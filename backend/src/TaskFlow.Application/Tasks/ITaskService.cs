using TaskFlow.Application.Tasks.Dtos;

namespace TaskFlow.Application.Tasks;

public interface ITaskService
{
    Task<IReadOnlyList<TaskDto>> GetTasksAsync(TaskFilterRequest filter, CancellationToken cancellationToken);

    Task<TaskDto?> GetTaskByIdAsync(int id, CancellationToken cancellationToken);

    Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken);

    Task<TaskDto?> UpdateTaskAsync(int id, UpdateTaskRequest request, CancellationToken cancellationToken);

    Task<TaskDto?> AssignUserAsync(int id, int? userId, CancellationToken cancellationToken);

    Task<TaskDto?> CompleteTaskAsync(int id, CancellationToken cancellationToken);

    Task<TaskDto?> ReopenTaskAsync(int id, CancellationToken cancellationToken);

    Task<bool> DeleteTaskAsync(int id, CancellationToken cancellationToken);
}
