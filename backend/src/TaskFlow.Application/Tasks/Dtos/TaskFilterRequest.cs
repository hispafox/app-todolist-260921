using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Tasks.Dtos;

public record TaskFilterRequest(
    string? Search,
    TaskStatusFilter Status,
    TaskPriority? Priority,
    string? Category);
