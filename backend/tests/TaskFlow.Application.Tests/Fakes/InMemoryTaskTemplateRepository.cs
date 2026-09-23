using TaskFlow.Application.Templates;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Tests.Fakes;

public class InMemoryTaskTemplateRepository : ITaskTemplateRepository
{
    public List<TaskTemplate> Templates { get; } = new();

    public Task<TaskTemplate?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        Task.FromResult(Templates.FirstOrDefault(t => t.Id == id));

    public Task<IReadOnlyList<TaskTemplate>> GetAllAsync(CancellationToken cancellationToken) =>
        Task.FromResult<IReadOnlyList<TaskTemplate>>(Templates.OrderBy(t => t.Title).ToList());

    public Task AddAsync(TaskTemplate template, CancellationToken cancellationToken)
    {
        template.Id = Templates.Count + 1;
        Templates.Add(template);
        return Task.CompletedTask;
    }

    public void Remove(TaskTemplate template) => Templates.Remove(template);

    public Task<bool> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(true);
}
