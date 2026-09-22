using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskFlow.Application.Common;
using TaskFlow.Application.Tasks;
using TaskFlow.Application.Users;
using TaskFlow.Infrastructure.Common;
using TaskFlow.Infrastructure.Persistence;
using TaskFlow.Infrastructure.Repositories;

namespace TaskFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("TaskFlow")
            ?? "Data Source=taskflow.db";

        services.AddDbContext<TaskFlowDbContext>(options => options.UseSqlite(connectionString));

        services.AddScoped<ITaskRepository, TaskRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddSingleton<IDateTimeProvider, SystemDateTimeProvider>();

        return services;
    }
}
