namespace TaskFlow.Application.Users.Dtos;

public record CreateUserRequest(
    string Name,
    string Email,
    string Color);
