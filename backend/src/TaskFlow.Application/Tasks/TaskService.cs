using TaskFlow.Application.Common;
using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Application.Users;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Tasks;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;
    private readonly IUserRepository _userRepository;
    private readonly IDateTimeProvider _dateTimeProvider;

    public TaskService(ITaskRepository repository, IUserRepository userRepository, IDateTimeProvider dateTimeProvider)
    {
        _repository = repository;
        _userRepository = userRepository;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<IReadOnlyList<TaskDto>> GetTasksAsync(TaskFilterRequest filter, CancellationToken cancellationToken)
    {
        var tasks = await _repository.GetAllAsync(filter, cancellationToken);
        return tasks.Select(t => t.ToDto()).ToList();
    }

    public async Task<TaskDto?> GetTaskByIdAsync(int id, CancellationToken cancellationToken)
    {
        var task = await _repository.GetByIdAsync(id, cancellationToken);
        return task?.ToDto();
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken)
    {
        await EnsureAssignedUserExistsAsync(request.AssignedUserId, cancellationToken);

        var now = _dateTimeProvider.UtcNow;
        var task = new TaskItem(
            request.Title,
            request.Description,
            (TaskPriority)request.Priority,
            request.Category,
            request.DueDate,
            request.AssignedUserId,
            now);

        await _repository.AddAsync(task, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return task.ToDto();
    }

    public async Task<TaskDto?> UpdateTaskAsync(int id, UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        var task = await _repository.GetByIdAsync(id, cancellationToken);
        if (task is null)
        {
            return null;
        }

        await EnsureAssignedUserExistsAsync(request.AssignedUserId, cancellationToken);

        task.Update(
            request.Title,
            request.Description,
            (TaskPriority)request.Priority,
            request.Category,
            request.DueDate,
            request.AssignedUserId,
            _dateTimeProvider.UtcNow);

        await _repository.SaveChangesAsync(cancellationToken);

        return task.ToDto();
    }

    public async Task<TaskDto?> AssignUserAsync(int id, int? userId, CancellationToken cancellationToken)
    {
        var task = await _repository.GetByIdAsync(id, cancellationToken);
        if (task is null)
        {
            return null;
        }

        await EnsureAssignedUserExistsAsync(userId, cancellationToken);

        task.AssignUser(userId, _dateTimeProvider.UtcNow);
        await _repository.SaveChangesAsync(cancellationToken);

        return task.ToDto();
    }

    public async Task<TaskDto?> CompleteTaskAsync(int id, CancellationToken cancellationToken)
    {
        var task = await _repository.GetByIdAsync(id, cancellationToken);
        if (task is null)
        {
            return null;
        }

        task.Complete(_dateTimeProvider.UtcNow);
        await _repository.SaveChangesAsync(cancellationToken);

        return task.ToDto();
    }

    public async Task<TaskDto?> ReopenTaskAsync(int id, CancellationToken cancellationToken)
    {
        var task = await _repository.GetByIdAsync(id, cancellationToken);
        if (task is null)
        {
            return null;
        }

        task.Reopen(_dateTimeProvider.UtcNow);
        await _repository.SaveChangesAsync(cancellationToken);

        return task.ToDto();
    }

    public async Task<bool> DeleteTaskAsync(int id, CancellationToken cancellationToken)
    {
        var task = await _repository.GetByIdAsync(id, cancellationToken);
        if (task is null)
        {
            return false;
        }

        _repository.Remove(task);
        await _repository.SaveChangesAsync(cancellationToken);

        return true;
    }

    private async Task EnsureAssignedUserExistsAsync(int? userId, CancellationToken cancellationToken)
    {
        if (userId.HasValue && !await _userRepository.ExistsAsync(userId.Value, cancellationToken))
        {
            throw new NotFoundException("El usuario asignado no existe.");
        }
    }
}
