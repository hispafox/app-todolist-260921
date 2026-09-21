using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Tasks;
using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;
using TaskFlow.Infrastructure.Persistence;

namespace TaskFlow.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly TaskFlowDbContext _dbContext;

    public TaskRepository(TaskFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<TaskItem?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

    public async Task<IReadOnlyList<TaskItem>> GetAllAsync(TaskFilterRequest filter, CancellationToken cancellationToken)
    {
        var query = _dbContext.Tasks.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim();
            query = query.Where(t =>
                EF.Functions.Like(t.Title, $"%{search}%") ||
                (t.Description != null && EF.Functions.Like(t.Description, $"%{search}%")));
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

        return await query
            .OrderBy(t => t.IsCompleted)
            .ThenByDescending(t => t.Priority)
            .ThenBy(t => t.DueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(TaskItem task, CancellationToken cancellationToken) =>
        await _dbContext.Tasks.AddAsync(task, cancellationToken);

    public void Remove(TaskItem task) => _dbContext.Tasks.Remove(task);

    public async Task<bool> SaveChangesAsync(CancellationToken cancellationToken) =>
        await _dbContext.SaveChangesAsync(cancellationToken) >= 0;
}
