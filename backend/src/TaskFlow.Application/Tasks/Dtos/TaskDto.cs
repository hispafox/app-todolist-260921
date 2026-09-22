namespace TaskFlow.Application.Tasks.Dtos;

public record TaskDto(
    int Id,
    string Title,
    string? Description,
    int Priority,
    string? Category,
    bool IsCompleted,
    DateTime? DueDate,
    int? AssignedUserId,
    DateTime CreatedAt,
    DateTime UpdatedAt);
