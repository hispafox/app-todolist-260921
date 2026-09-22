using TaskFlow.Application.Common;
using TaskFlow.Application.Users.Dtos;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Users;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<UserDto>> GetUsersAsync(CancellationToken cancellationToken)
    {
        var users = await _repository.GetAllAsync(cancellationToken);
        return users.Select(u => u.ToDto()).ToList();
    }

    public async Task<UserDto?> GetUserByIdAsync(int id, CancellationToken cancellationToken)
    {
        var user = await _repository.GetByIdAsync(id, cancellationToken);
        return user?.ToDto();
    }

    public async Task<UserDto> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken)
    {
        if (await _repository.EmailExistsAsync(request.Email, null, cancellationToken))
        {
            throw new ConflictException("Ya existe un usuario con ese email.");
        }

        var user = new AppUser(request.Name, request.Email, request.Color);

        await _repository.AddAsync(user, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return user.ToDto();
    }

    public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _repository.GetByIdAsync(id, cancellationToken);
        if (user is null)
        {
            return null;
        }

        if (await _repository.EmailExistsAsync(request.Email, id, cancellationToken))
        {
            throw new ConflictException("Ya existe un usuario con ese email.");
        }

        user.Update(request.Name, request.Email, request.Color);
        await _repository.SaveChangesAsync(cancellationToken);

        return user.ToDto();
    }

    public async Task<bool> DeleteUserAsync(int id, CancellationToken cancellationToken)
    {
        var user = await _repository.GetByIdAsync(id, cancellationToken);
        if (user is null)
        {
            return false;
        }

        _repository.Remove(user);
        await _repository.SaveChangesAsync(cancellationToken);

        return true;
    }
}
