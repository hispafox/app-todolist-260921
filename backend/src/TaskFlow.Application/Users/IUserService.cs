using TaskFlow.Application.Users.Dtos;

namespace TaskFlow.Application.Users;

public interface IUserService
{
    Task<IReadOnlyList<UserDto>> GetUsersAsync(CancellationToken cancellationToken);

    Task<UserDto?> GetUserByIdAsync(int id, CancellationToken cancellationToken);

    Task<UserDto> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken);

    Task<UserDto?> UpdateUserAsync(int id, UpdateUserRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteUserAsync(int id, CancellationToken cancellationToken);
}
