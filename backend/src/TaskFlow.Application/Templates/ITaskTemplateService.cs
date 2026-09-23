using TaskFlow.Application.Templates.Dtos;

namespace TaskFlow.Application.Templates;

public interface ITaskTemplateService
{
    Task<IReadOnlyList<TaskTemplateDto>> GetTemplatesAsync(CancellationToken cancellationToken);

    Task<TaskTemplateDto?> GetTemplateByIdAsync(int id, CancellationToken cancellationToken);

    Task<TaskTemplateDto> CreateTemplateAsync(CreateTaskTemplateRequest request, CancellationToken cancellationToken);

    Task<TaskTemplateDto?> UpdateTemplateAsync(int id, UpdateTaskTemplateRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteTemplateAsync(int id, CancellationToken cancellationToken);
}
