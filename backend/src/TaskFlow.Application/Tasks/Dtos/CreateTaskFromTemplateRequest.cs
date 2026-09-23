namespace TaskFlow.Application.Tasks.Dtos;

public record CreateTaskFromTemplateRequest(
    DateTime? DueDate,
    int? AssignedUserId);
