using TaskFlow.Application.Tasks;
using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Tests.Fakes;

public class InMemoryTaskRepository : ITaskRepository
{
    public List<TaskItem> Tasks { get; } = new();

    public Task<TaskItem?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        Task.FromResult(Tasks.FirstOrDefault(t => t.Id == id));

    public Task<IReadOnlyList<TaskItem>> GetAllAsync(TaskFilterRequest filter, CancellationToken cancellationToken)
    {
        IEnumerable<TaskItem> query = Tasks;

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim();
            query = query.Where(t =>
                t.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                (t.Description?.Contains(search, StringComparison.OrdinalIgnoreCase) ?? false));
        }

        query = filter.Status switch
        {
            TaskStatusFilter.Pending => query.Where(t => !t.IsCompleted),
            TaskStatusFilter.Completed => query.Where(t => t.IsCompleted),
            _ => query,
        };

        if (filter.Priority.HasValue)
        {
            query = query.Where(t => t.Priority == filter.Priority.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Category))
        {
            query = query.Where(t => t.Category == filter.Category);
        }

        return Task.FromResult<IReadOnlyList<TaskItem>>(query.ToList());
    }

    public Task AddAsync(TaskItem task, CancellationToken cancellationToken)
    {
        task.Id = Tasks.Count + 1;
        Tasks.Add(task);
        return Task.CompletedTask;
    }

    public void Remove(TaskItem task) => Tasks.Remove(task);

    public Task<bool> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(true);
}
