using FluentValidation;
using FluentValidation.Results;
using TaskFlow.Application.Users;
using TaskFlow.Application.Users.Dtos;

namespace TaskFlow.Api.Users;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users").WithTags("Users");

        group.MapGet("/", GetUsersAsync);
        group.MapGet("/{id:int}", GetUserByIdAsync);
        group.MapPost("/", CreateUserAsync);
        group.MapPut("/{id:int}", UpdateUserAsync);
        group.MapDelete("/{id:int}", DeleteUserAsync);

        return app;
    }

    private static async Task<IResult> GetUsersAsync(IUserService userService, CancellationToken cancellationToken)
    {
        var users = await userService.GetUsersAsync(cancellationToken);
        return Results.Ok(users);
    }

    private static async Task<IResult> GetUserByIdAsync(int id, IUserService userService, CancellationToken cancellationToken)
    {
        var user = await userService.GetUserByIdAsync(id, cancellationToken);
        return user is null ? Results.NotFound() : Results.Ok(user);
    }

    private static async Task<IResult> CreateUserAsync(
        CreateUserRequest request,
        IUserService userService,
        IValidator<CreateUserRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Results.ValidationProblem(validation.ToDictionary());
        }

        var user = await userService.CreateUserAsync(request, cancellationToken);
        return Results.Created($"/api/users/{user.Id}", user);
    }

    private static async Task<IResult> UpdateUserAsync(
        int id,
        UpdateUserRequest request,
        IUserService userService,
        IValidator<UpdateUserRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Results.ValidationProblem(validation.ToDictionary());
        }

        var user = await userService.UpdateUserAsync(id, request, cancellationToken);
        return user is null ? Results.NotFound() : Results.Ok(user);
    }

    private static async Task<IResult> DeleteUserAsync(int id, IUserService userService, CancellationToken cancellationToken)
    {
        var deleted = await userService.DeleteUserAsync(id, cancellationToken);
        return deleted ? Results.NoContent() : Results.NotFound();
    }

    private static IDictionary<string, string[]> ToDictionary(this ValidationResult result) =>
        result.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
}
