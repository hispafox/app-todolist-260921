namespace TaskFlow.Application.Templates.Dtos;

public record CreateTaskTemplateRequest(
    string Title,
    string? Description,
    int Priority,
    string? Category);
