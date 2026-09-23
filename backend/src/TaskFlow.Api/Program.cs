using Microsoft.AspNetCore.Diagnostics;
using Scalar.AspNetCore;
using TaskFlow.Api.Tasks;
using TaskFlow.Api.Templates;
using TaskFlow.Api.Users;
using TaskFlow.Application;
using TaskFlow.Application.Common;
using TaskFlow.Infrastructure;
using TaskFlow.Infrastructure.Persistence;

const string FrontendCorsPolicy = "FrontendCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapScalarApiReference(options =>
    {
        options
            .WithTitle("TaskFlow API")
            .WithOpenApiRoutePattern("/swagger/v1/swagger.json");
    });
}

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var feature = context.Features.Get<IExceptionHandlerFeature>();
        var exception = feature?.Error;

        if (exception is NotFoundException)
        {
            await Results.Problem(
                title: "Recurso no encontrado",
                detail: exception.Message,
                statusCode: StatusCodes.Status404NotFound).ExecuteAsync(context);
            return;
        }

        if (exception is ConflictException)
        {
            await Results.Problem(
                title: "Conflicto",
                detail: exception.Message,
                statusCode: StatusCodes.Status409Conflict).ExecuteAsync(context);
            return;
        }

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await Results.Problem(
            title: "Error interno",
            detail: exception?.Message,
            statusCode: StatusCodes.Status500InternalServerError).ExecuteAsync(context);
    });
});

app.UseCors(FrontendCorsPolicy);

app.MapTaskEndpoints();
app.MapUserEndpoints();
app.MapTemplateEndpoints();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TaskFlowDbContext>();
    await DbInitializer.InitializeAsync(dbContext);
}

app.Run();

public partial class Program
{
}
