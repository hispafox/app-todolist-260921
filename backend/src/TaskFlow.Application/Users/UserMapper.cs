using TaskFlow.Application.Users.Dtos;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Users;

public static class UserMapper
{
    public static UserDto ToDto(this AppUser user) => new(
        user.Id,
        user.Name,
        user.Email,
        user.Color);
}
