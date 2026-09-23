using FluentValidation;
using FluentValidation.Results;
using TaskFlow.Application.Tasks;
using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Application.Templates;
using TaskFlow.Application.Templates.Dtos;

namespace TaskFlow.Api.Templates;

public static class TemplateEndpoints
{
    public static IEndpointRouteBuilder MapTemplateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/templates").WithTags("Templates");

        group.MapGet("/", GetTemplatesAsync);
        group.MapGet("/{id:int}", GetTemplateByIdAsync);
        group.MapPost("/", CreateTemplateAsync);
        group.MapPut("/{id:int}", UpdateTemplateAsync);
        group.MapDelete("/{id:int}", DeleteTemplateAsync);
        group.MapPost("/{id:int}/tasks", CreateTaskFromTemplateAsync);

        return app;
    }

    private static async Task<IResult> GetTemplatesAsync(ITaskTemplateService templateService, CancellationToken cancellationToken)
    {
        var templates = await templateService.GetTemplatesAsync(cancellationToken);
        return Results.Ok(templates);
    }

    private static async Task<IResult> GetTemplateByIdAsync(int id, ITaskTemplateService templateService, CancellationToken cancellationToken)
    {
        var template = await templateService.GetTemplateByIdAsync(id, cancellationToken);
        return template is null ? Results.NotFound() : Results.Ok(template);
    }

    private static async Task<IResult> CreateTemplateAsync(
        CreateTaskTemplateRequest request,
        ITaskTemplateService templateService,
        IValidator<CreateTaskTemplateRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Results.ValidationProblem(validation.ToDictionary());
        }

        var template = await templateService.CreateTemplateAsync(request, cancellationToken);
        return Results.Created($"/api/templates/{template.Id}", template);
    }

    private static async Task<IResult> UpdateTemplateAsync(
        int id,
        UpdateTaskTemplateRequest request,
        ITaskTemplateService templateService,
        IValidator<UpdateTaskTemplateRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Results.ValidationProblem(validation.ToDictionary());
        }

        var template = await templateService.UpdateTemplateAsync(id, request, cancellationToken);
        return template is null ? Results.NotFound() : Results.Ok(template);
    }

    private static async Task<IResult> DeleteTemplateAsync(int id, ITaskTemplateService templateService, CancellationToken cancellationToken)
    {
        var deleted = await templateService.DeleteTemplateAsync(id, cancellationToken);
        return deleted ? Results.NoContent() : Results.NotFound();
    }

    private static async Task<IResult> CreateTaskFromTemplateAsync(
        int id,
        CreateTaskFromTemplateRequest request,
        ITaskService taskService,
        CancellationToken cancellationToken)
    {
        var task = await taskService.CreateTaskFromTemplateAsync(id, request, cancellationToken);
        return task is null ? Results.NotFound() : Results.Created($"/api/tasks/{task.Id}", task);
    }

    private static IDictionary<string, string[]> ToDictionary(this ValidationResult result) =>
        result.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
}
