using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Templates;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Persistence;

namespace TaskFlow.Infrastructure.Repositories;

public class TaskTemplateRepository : ITaskTemplateRepository
{
    private readonly TaskFlowDbContext _dbContext;

    public TaskTemplateRepository(TaskFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<TaskTemplate?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        _dbContext.Templates.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

    public async Task<IReadOnlyList<TaskTemplate>> GetAllAsync(CancellationToken cancellationToken) =>
        await _dbContext.Templates.OrderBy(t => t.Title).ToListAsync(cancellationToken);

    public async Task AddAsync(TaskTemplate template, CancellationToken cancellationToken) =>
        await _dbContext.Templates.AddAsync(template, cancellationToken);

    public void Remove(TaskTemplate template) => _dbContext.Templates.Remove(template);

    public async Task<bool> SaveChangesAsync(CancellationToken cancellationToken) =>
        await _dbContext.SaveChangesAsync(cancellationToken) >= 0;
}
