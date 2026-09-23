using TaskFlow.Application.Templates.Dtos;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Templates;

public static class TaskTemplateMapper
{
    public static TaskTemplateDto ToDto(this TaskTemplate template) => new(
        template.Id,
        template.Title,
        template.Description,
        (int)template.Priority,
        template.Category);
}
