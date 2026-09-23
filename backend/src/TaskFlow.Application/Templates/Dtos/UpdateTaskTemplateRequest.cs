namespace TaskFlow.Application.Templates.Dtos;

public record UpdateTaskTemplateRequest(
    string Title,
    string? Description,
    int Priority,
    string? Category);
