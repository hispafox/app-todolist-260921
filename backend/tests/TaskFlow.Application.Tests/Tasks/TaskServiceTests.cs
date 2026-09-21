using FluentAssertions;
using TaskFlow.Application.Tasks;
using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Application.Tests.Fakes;
using TaskFlow.Domain.Enums;
using Xunit;

namespace TaskFlow.Application.Tests.Tasks;

public class TaskServiceTests
{
    private static readonly DateTime Now = new(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc);

    private static (TaskService Service, InMemoryTaskRepository Repository) CreateSut()
    {
        var repository = new InMemoryTaskRepository();
        var clock = new FixedDateTimeProvider(Now);
        return (new TaskService(repository, clock), repository);
    }

    [Fact]
    public async Task CreateTaskAsync_PersistsTaskWithCreationTimestamps()
    {
        var (service, repository) = CreateSut();
        var request = new CreateTaskRequest("Comprar leche", "Ir al supermercado", (int)TaskPriority.Medium, "Personal", null);

        var result = await service.CreateTaskAsync(request, CancellationToken.None);

        result.Title.Should().Be("Comprar leche");
        result.CreatedAt.Should().Be(Now);
        result.UpdatedAt.Should().Be(Now);
        result.IsCompleted.Should().BeFalse();
        repository.Tasks.Should().ContainSingle();
    }

    [Fact]
    public async Task GetTaskByIdAsync_ReturnsNull_WhenTaskDoesNotExist()
    {
        var (service, _) = CreateSut();

        var result = await service.GetTaskByIdAsync(999, CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateTaskAsync_UpdatesFieldsAndTimestamp()
    {
        var (service, _) = CreateSut();
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Título original", null, (int)TaskPriority.Low, null, null),
            CancellationToken.None);

        var updated = await service.UpdateTaskAsync(
            created.Id,
            new UpdateTaskRequest("Título actualizado", "Nueva descripción", (int)TaskPriority.High, "Trabajo", Now.AddDays(1)),
            CancellationToken.None);

        updated.Should().NotBeNull();
        updated!.Title.Should().Be("Título actualizado");
        updated.Priority.Should().Be((int)TaskPriority.High);
        updated.Category.Should().Be("Trabajo");
    }

    [Fact]
    public async Task CompleteTaskAsync_MarksTaskAsCompleted()
    {
        var (service, _) = CreateSut();
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea", null, (int)TaskPriority.Medium, null, null),
            CancellationToken.None);

        var completed = await service.CompleteTaskAsync(created.Id, CancellationToken.None);

        completed!.IsCompleted.Should().BeTrue();
    }

    [Fact]
    public async Task ReopenTaskAsync_MarksCompletedTaskAsPending()
    {
        var (service, _) = CreateSut();
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea", null, (int)TaskPriority.Medium, null, null),
            CancellationToken.None);
        await service.CompleteTaskAsync(created.Id, CancellationToken.None);

        var reopened = await service.ReopenTaskAsync(created.Id, CancellationToken.None);

        reopened!.IsCompleted.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteTaskAsync_ReturnsFalse_WhenTaskDoesNotExist()
    {
        var (service, _) = CreateSut();

        var deleted = await service.DeleteTaskAsync(123, CancellationToken.None);

        deleted.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteTaskAsync_RemovesExistingTask()
    {
        var (service, repository) = CreateSut();
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea a eliminar", null, (int)TaskPriority.Medium, null, null),
            CancellationToken.None);

        var deleted = await service.DeleteTaskAsync(created.Id, CancellationToken.None);

        deleted.Should().BeTrue();
        repository.Tasks.Should().BeEmpty();
    }

    [Fact]
    public async Task GetTasksAsync_FiltersByStatusPriorityAndCategory()
    {
        var (service, _) = CreateSut();
        var pendingHigh = await service.CreateTaskAsync(
            new CreateTaskRequest("Urgente", null, (int)TaskPriority.High, "Trabajo", null), CancellationToken.None);
        var completedLow = await service.CreateTaskAsync(
            new CreateTaskRequest("Rutina", null, (int)TaskPriority.Low, "Personal", null), CancellationToken.None);
        await service.CompleteTaskAsync(completedLow.Id, CancellationToken.None);

        var pendingResults = await service.GetTasksAsync(
            new TaskFilterRequest(null, TaskStatusFilter.Pending, null, null), CancellationToken.None);

        pendingResults.Should().ContainSingle(t => t.Id == pendingHigh.Id);
    }
}
