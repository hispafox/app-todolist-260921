namespace TaskFlow.Application.Tasks.Dtos;

public record UpdateTaskRequest(
    string Title,
    string? Description,
    int Priority,
    string? Category,
    DateTime? DueDate,
    int? AssignedUserId);
