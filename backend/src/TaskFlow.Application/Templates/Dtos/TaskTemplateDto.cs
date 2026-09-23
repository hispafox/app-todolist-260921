namespace TaskFlow.Application.Templates.Dtos;

public record TaskTemplateDto(
    int Id,
    string Title,
    string? Description,
    int Priority,
    string? Category);
