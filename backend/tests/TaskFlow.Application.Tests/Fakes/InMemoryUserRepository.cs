using TaskFlow.Application.Users;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Tests.Fakes;

public class InMemoryUserRepository : IUserRepository
{
    public List<AppUser> Users { get; } = new();

    public Task<AppUser?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        Task.FromResult(Users.FirstOrDefault(u => u.Id == id));

    public Task<IReadOnlyList<AppUser>> GetAllAsync(CancellationToken cancellationToken) =>
        Task.FromResult<IReadOnlyList<AppUser>>(Users.OrderBy(u => u.Name).ToList());

    public Task<bool> ExistsAsync(int id, CancellationToken cancellationToken) =>
        Task.FromResult(Users.Any(u => u.Id == id));

    public Task<bool> EmailExistsAsync(string email, int? excludeId, CancellationToken cancellationToken) =>
        Task.FromResult(Users.Any(u => u.Email == email && u.Id != excludeId));

    public Task AddAsync(AppUser user, CancellationToken cancellationToken)
    {
        user.Id = Users.Count + 1;
        Users.Add(user);
        return Task.CompletedTask;
    }

    public void Remove(AppUser user) => Users.Remove(user);

    public Task<bool> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(true);
}
