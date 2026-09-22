using TaskFlow.Domain.Enums;

namespace TaskFlow.Domain.Entities;

public class TaskItem
{
    public int Id { get; internal set; }
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public TaskPriority Priority { get; private set; }
    public string? Category { get; private set; }
    public bool IsCompleted { get; private set; }
    public DateTime? DueDate { get; private set; }
    public int? AssignedUserId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Requerido por EF Core.
    private TaskItem()
    {
    }

    public TaskItem(string title, string? description, TaskPriority priority, string? category, DateTime? dueDate, int? assignedUserId, DateTime now)
    {
        SetTitle(title);
        Description = description;
        Priority = priority;
        Category = category;
        DueDate = dueDate;
        AssignedUserId = assignedUserId;
        CreatedAt = now;
        UpdatedAt = now;
    }

    public void Update(string title, string? description, TaskPriority priority, string? category, DateTime? dueDate, int? assignedUserId, DateTime now)
    {
        SetTitle(title);
        Description = description;
        Priority = priority;
        Category = category;
        DueDate = dueDate;
        AssignedUserId = assignedUserId;
        UpdatedAt = now;
    }

    public void AssignUser(int? userId, DateTime now)
    {
        AssignedUserId = userId;
        UpdatedAt = now;
    }

    public void Complete(DateTime now)
    {
        IsCompleted = true;
        UpdatedAt = now;
    }

    public void Reopen(DateTime now)
    {
        IsCompleted = false;
        UpdatedAt = now;
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
