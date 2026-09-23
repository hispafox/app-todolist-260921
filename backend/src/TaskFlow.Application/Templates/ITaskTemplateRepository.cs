using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Templates;

public interface ITaskTemplateRepository
{
    Task<TaskTemplate?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<IReadOnlyList<TaskTemplate>> GetAllAsync(CancellationToken cancellationToken);

    Task AddAsync(TaskTemplate template, CancellationToken cancellationToken);

    void Remove(TaskTemplate template);

    Task<bool> SaveChangesAsync(CancellationToken cancellationToken);
}
