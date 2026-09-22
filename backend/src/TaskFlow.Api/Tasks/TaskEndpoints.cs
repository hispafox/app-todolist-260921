using FluentValidation;
using FluentValidation.Results;
using TaskFlow.Application.Tasks;
using TaskFlow.Application.Tasks.Dtos;

namespace TaskFlow.Api.Tasks;

public static class TaskEndpoints
{
    public static IEndpointRouteBuilder MapTaskEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tasks").WithTags("Tasks");

        group.MapGet("/", GetTasksAsync);
        group.MapGet("/{id:int}", GetTaskByIdAsync);
        group.MapPost("/", CreateTaskAsync);
        group.MapPut("/{id:int}", UpdateTaskAsync);
        group.MapPatch("/{id:int}/complete", CompleteTaskAsync);
        group.MapPatch("/{id:int}/reopen", ReopenTaskAsync);
        group.MapPatch("/{id:int}/assign", AssignUserAsync);
        group.MapDelete("/{id:int}", DeleteTaskAsync);

        return app;
    }

    private static async Task<IResult> GetTasksAsync(
        [AsParameters] TaskQueryParameters query,
        ITaskService taskService,
        CancellationToken cancellationToken)
    {
        var tasks = await taskService.GetTasksAsync(query.ToFilterRequest(), cancellationToken);
        return Results.Ok(tasks);
    }

    private static async Task<IResult> GetTaskByIdAsync(int id, ITaskService taskService, CancellationToken cancellationToken)
    {
        var task = await taskService.GetTaskByIdAsync(id, cancellationToken);
        return task is null ? Results.NotFound() : Results.Ok(task);
    }

    private static async Task<IResult> CreateTaskAsync(
        CreateTaskRequest request,
        ITaskService taskService,
        IValidator<CreateTaskRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Results.ValidationProblem(validation.ToDictionary());
        }

        var task = await taskService.CreateTaskAsync(request, cancellationToken);
        return Results.Created($"/api/tasks/{task.Id}", task);
    }

    private static async Task<IResult> UpdateTaskAsync(
        int id,
        UpdateTaskRequest request,
        ITaskService taskService,
        IValidator<UpdateTaskRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Results.ValidationProblem(validation.ToDictionary());
        }

        var task = await taskService.UpdateTaskAsync(id, request, cancellationToken);
        return task is null ? Results.NotFound() : Results.Ok(task);
    }

    private static async Task<IResult> CompleteTaskAsync(int id, ITaskService taskService, CancellationToken cancellationToken)
    {
        var task = await taskService.CompleteTaskAsync(id, cancellationToken);
        return task is null ? Results.NotFound() : Results.Ok(task);
    }

    private static async Task<IResult> ReopenTaskAsync(int id, ITaskService taskService, CancellationToken cancellationToken)
    {
        var task = await taskService.ReopenTaskAsync(id, cancellationToken);
        return task is null ? Results.NotFound() : Results.Ok(task);
    }

    private static async Task<IResult> AssignUserAsync(
        int id,
        AssignTaskRequest request,
        ITaskService taskService,
        CancellationToken cancellationToken)
    {
        var task = await taskService.AssignUserAsync(id, request.UserId, cancellationToken);
        return task is null ? Results.NotFound() : Results.Ok(task);
    }

    private static async Task<IResult> DeleteTaskAsync(int id, ITaskService taskService, CancellationToken cancellationToken)
    {
        var deleted = await taskService.DeleteTaskAsync(id, cancellationToken);
        return deleted ? Results.NoContent() : Results.NotFound();
    }

    private static IDictionary<string, string[]> ToDictionary(this ValidationResult result) =>
        result.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
}
