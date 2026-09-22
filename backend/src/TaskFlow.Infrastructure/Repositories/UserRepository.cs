using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Users;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Persistence;

namespace TaskFlow.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly TaskFlowDbContext _dbContext;

    public UserRepository(TaskFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<AppUser?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

    public async Task<IReadOnlyList<AppUser>> GetAllAsync(CancellationToken cancellationToken) =>
        await _dbContext.Users.OrderBy(u => u.Name).ToListAsync(cancellationToken);

    public Task<bool> ExistsAsync(int id, CancellationToken cancellationToken) =>
        _dbContext.Users.AnyAsync(u => u.Id == id, cancellationToken);

    public Task<bool> EmailExistsAsync(string email, int? excludeId, CancellationToken cancellationToken) =>
        _dbContext.Users.AnyAsync(u => u.Email == email && u.Id != excludeId, cancellationToken);

    public async Task AddAsync(AppUser user, CancellationToken cancellationToken) =>
        await _dbContext.Users.AddAsync(user, cancellationToken);

    public void Remove(AppUser user) => _dbContext.Users.Remove(user);

    public async Task<bool> SaveChangesAsync(CancellationToken cancellationToken) =>
        await _dbContext.SaveChangesAsync(cancellationToken) >= 0;
}
