using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace TaskFlow.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<Tasks.ITaskService, Tasks.TaskService>();
        services.AddScoped<Users.IUserService, Users.UserService>();
        services.AddValidatorsFromAssemblyContaining(typeof(DependencyInjection));

        return services;
    }
}
