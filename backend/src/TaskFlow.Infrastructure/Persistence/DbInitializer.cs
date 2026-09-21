using Microsoft.EntityFrameworkCore;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Infrastructure.Persistence;

/// <summary>Aplica migraciones pendientes e inserta datos de ejemplo si la base de datos está vacía.</summary>
public static class DbInitializer
{
    public static async Task InitializeAsync(TaskFlowDbContext dbContext)
    {
        await dbContext.Database.MigrateAsync();

        if (await dbContext.Tasks.AnyAsync())
        {
            return;
        }

        var now = DateTime.UtcNow;
        dbContext.Tasks.AddRange(
            new TaskItem("Preparar formación de Copilot", "Repasar la demo de agentes para la sesión de mañana.", TaskPriority.High, "Formación", now.AddDays(2), now),
            new TaskItem("Revisar PRD de TaskFlow", "Confirmar alcance de filtros y búsqueda.", TaskPriority.Medium, "Trabajo", now.AddDays(5), now),
            new TaskItem("Comprar material de oficina", null, TaskPriority.Low, "Personal", null, now));

        await dbContext.SaveChangesAsync();
    }
}
