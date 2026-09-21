using TaskFlow.Domain.Enums;

namespace TaskFlow.Api.Tasks;

public class TaskQueryParameters
{
    public string? Search { get; init; }
    public string? Status { get; init; }
    public int? Priority { get; init; }
    public string? Category { get; init; }

    public Application.Tasks.Dtos.TaskFilterRequest ToFilterRequest()
    {
        var status = Status?.Trim().ToLowerInvariant() switch
        {
            "pending" => TaskStatusFilter.Pending,
            "completed" => TaskStatusFilter.Completed,
            _ => TaskStatusFilter.All,
        };

        TaskPriority? priority = Priority is int value && Enum.IsDefined(typeof(TaskPriority), value)
            ? (TaskPriority)value
            : null;

        return new Application.Tasks.Dtos.TaskFilterRequest(Search, status, priority, Category);
    }
}
