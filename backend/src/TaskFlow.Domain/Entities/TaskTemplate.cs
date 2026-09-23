using TaskFlow.Domain.Enums;

namespace TaskFlow.Domain.Entities;

public class TaskTemplate
{
    public int Id { get; internal set; }
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public TaskPriority Priority { get; private set; }
    public string? Category { get; private set; }

    // Requerido por EF Core.
    private TaskTemplate()
    {
    }

    public TaskTemplate(string title, string? description, TaskPriority priority, string? category)
    {
        SetTitle(title);
        Description = description;
        Priority = priority;
        Category = category;
    }

    public void Update(string title, string? description, TaskPriority priority, string? category)
    {
        SetTitle(title);
        Description = description;
        Priority = priority;
        Category = category;
    }

    private void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("El título es obligatorio.", nameof(title));
        }

        Title = title.Trim();
    }
}
