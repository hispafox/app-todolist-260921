using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Tasks;

public interface ITaskRepository
{
    Task<TaskItem?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<IReadOnlyList<TaskItem>> GetAllAsync(Dtos.TaskFilterRequest filter, CancellationToken cancellationToken);

    Task AddAsync(TaskItem task, CancellationToken cancellationToken);

    void Remove(TaskItem task);

    Task<bool> SaveChangesAsync(CancellationToken cancellationToken);
}
