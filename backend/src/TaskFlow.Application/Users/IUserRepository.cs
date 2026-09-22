using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Users;

public interface IUserRepository
{
    Task<AppUser?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<IReadOnlyList<AppUser>> GetAllAsync(CancellationToken cancellationToken);

    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken);

    Task<bool> EmailExistsAsync(string email, int? excludeId, CancellationToken cancellationToken);

    Task AddAsync(AppUser user, CancellationToken cancellationToken);

    void Remove(AppUser user);

    Task<bool> SaveChangesAsync(CancellationToken cancellationToken);
}
