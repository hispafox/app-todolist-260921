using TaskFlow.Application.Templates.Dtos;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Templates;

public class TaskTemplateService : ITaskTemplateService
{
    private readonly ITaskTemplateRepository _repository;

    public TaskTemplateService(ITaskTemplateRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<TaskTemplateDto>> GetTemplatesAsync(CancellationToken cancellationToken)
    {
        var templates = await _repository.GetAllAsync(cancellationToken);
        return templates.Select(t => t.ToDto()).ToList();
    }

    public async Task<TaskTemplateDto?> GetTemplateByIdAsync(int id, CancellationToken cancellationToken)
    {
        var template = await _repository.GetByIdAsync(id, cancellationToken);
        return template?.ToDto();
    }

    public async Task<TaskTemplateDto> CreateTemplateAsync(CreateTaskTemplateRequest request, CancellationToken cancellationToken)
    {
        var template = new TaskTemplate(
            request.Title,
            request.Description,
            (TaskPriority)request.Priority,
            request.Category);

        await _repository.AddAsync(template, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return template.ToDto();
    }

    public async Task<TaskTemplateDto?> UpdateTemplateAsync(int id, UpdateTaskTemplateRequest request, CancellationToken cancellationToken)
    {
        var template = await _repository.GetByIdAsync(id, cancellationToken);
        if (template is null)
        {
            return null;
        }

        template.Update(
            request.Title,
            request.Description,
            (TaskPriority)request.Priority,
            request.Category);

        await _repository.SaveChangesAsync(cancellationToken);

        return template.ToDto();
    }

    public async Task<bool> DeleteTemplateAsync(int id, CancellationToken cancellationToken)
    {
        var template = await _repository.GetByIdAsync(id, cancellationToken);
        if (template is null)
        {
            return false;
        }

        _repository.Remove(template);
        await _repository.SaveChangesAsync(cancellationToken);

        return true;
    }
}
