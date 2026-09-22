namespace TaskFlow.Application.Users.Dtos;

public record UpdateUserRequest(
    string Name,
    string Email,
    string Color);
