namespace TaskFlow.Application.Tasks.Dtos;

public record CreateTaskRequest(
    string Title,
    string? Description,
    int Priority,
    string? Category,
    DateTime? DueDate);
