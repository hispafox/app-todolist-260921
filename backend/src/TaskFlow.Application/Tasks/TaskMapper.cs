using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Tasks;

public static class TaskMapper
{
    public static TaskDto ToDto(this TaskItem task) => new(
        task.Id,
        task.Title,
        task.Description,
        (int)task.Priority,
        task.Category,
        task.IsCompleted,
        task.DueDate,
        task.AssignedUserId,
        task.CreatedAt,
        task.UpdatedAt);
}
