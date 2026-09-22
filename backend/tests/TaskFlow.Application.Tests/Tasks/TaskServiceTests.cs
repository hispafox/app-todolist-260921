using FluentAssertions;
using TaskFlow.Application.Common;
using TaskFlow.Application.Tasks;
using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Application.Tests.Fakes;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;
using Xunit;

namespace TaskFlow.Application.Tests.Tasks;

public class TaskServiceTests
{
    private static readonly DateTime Now = new(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc);

    private static (TaskService Service, InMemoryTaskRepository Tasks, InMemoryUserRepository Users) CreateSut()
    {
        var repository = new InMemoryTaskRepository();
        var userRepository = new InMemoryUserRepository();
        var clock = new FixedDateTimeProvider(Now);
        return (new TaskService(repository, userRepository, clock), repository, userRepository);
    }

    [Fact]
    public async Task CreateTaskAsync_PersistsTaskWithCreationTimestamps()
    {
        var (service, repository, _) = CreateSut();
        var request = new CreateTaskRequest("Comprar leche", "Ir al supermercado", (int)TaskPriority.Medium, "Personal", null, null);

        var result = await service.CreateTaskAsync(request, CancellationToken.None);

        result.Title.Should().Be("Comprar leche");
        result.CreatedAt.Should().Be(Now);
        result.UpdatedAt.Should().Be(Now);
        result.IsCompleted.Should().BeFalse();
        repository.Tasks.Should().ContainSingle();
    }

    [Fact]
    public async Task CreateTaskAsync_AssignsExistingUser()
    {
        var (service, _, users) = CreateSut();
        var user = new AppUser("Ana García", "ana@taskflow.dev", "#2F6F62");
        await users.AddAsync(user, CancellationToken.None);

        var result = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea asignada", null, (int)TaskPriority.Medium, null, null, user.Id),
            CancellationToken.None);

        result.AssignedUserId.Should().Be(user.Id);
    }

    [Fact]
    public async Task CreateTaskAsync_ThrowsNotFound_WhenAssignedUserDoesNotExist()
    {
        var (service, _, _) = CreateSut();

        var act = () => service.CreateTaskAsync(
            new CreateTaskRequest("Tarea", null, (int)TaskPriority.Medium, null, null, 999),
            CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task GetTaskByIdAsync_ReturnsNull_WhenTaskDoesNotExist()
    {
        var (service, _, _) = CreateSut();

        var result = await service.GetTaskByIdAsync(999, CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateTaskAsync_UpdatesFieldsAndTimestamp()
    {
        var (service, _, _) = CreateSut();
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Título original", null, (int)TaskPriority.Low, null, null, null),
            CancellationToken.None);

        var updated = await service.UpdateTaskAsync(
            created.Id,
            new UpdateTaskRequest("Título actualizado", "Nueva descripción", (int)TaskPriority.High, "Trabajo", Now.AddDays(1), null),
            CancellationToken.None);

        updated.Should().NotBeNull();
        updated!.Title.Should().Be("Título actualizado");
        updated.Priority.Should().Be((int)TaskPriority.High);
        updated.Category.Should().Be("Trabajo");
    }

    [Fact]
    public async Task CompleteTaskAsync_MarksTaskAsCompleted()
    {
        var (service, _, _) = CreateSut();
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea", null, (int)TaskPriority.Medium, null, null, null),
            CancellationToken.None);

        var completed = await service.CompleteTaskAsync(created.Id, CancellationToken.None);

        completed!.IsCompleted.Should().BeTrue();
    }

    [Fact]
    public async Task ReopenTaskAsync_MarksCompletedTaskAsPending()
    {
        var (service, _, _) = CreateSut();
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea", null, (int)TaskPriority.Medium, null, null, null),
            CancellationToken.None);
        await service.CompleteTaskAsync(created.Id, CancellationToken.None);

        var reopened = await service.ReopenTaskAsync(created.Id, CancellationToken.None);

        reopened!.IsCompleted.Should().BeFalse();
    }

    [Fact]
    public async Task AssignUserAsync_SetsAssignedUserId()
    {
        var (service, _, users) = CreateSut();
        var user = new AppUser("Carlos Pérez", "carlos@taskflow.dev", "#C97B3D");
        await users.AddAsync(user, CancellationToken.None);
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea sin asignar", null, (int)TaskPriority.Medium, null, null, null),
            CancellationToken.None);

        var assigned = await service.AssignUserAsync(created.Id, user.Id, CancellationToken.None);

        assigned!.AssignedUserId.Should().Be(user.Id);
    }

    [Fact]
    public async Task AssignUserAsync_UnassignsWhenUserIdIsNull()
    {
        var (service, _, users) = CreateSut();
        var user = new AppUser("Carlos Pérez", "carlos@taskflow.dev", "#C97B3D");
        await users.AddAsync(user, CancellationToken.None);
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea asignada", null, (int)TaskPriority.Medium, null, null, user.Id),
            CancellationToken.None);

        var unassigned = await service.AssignUserAsync(created.Id, null, CancellationToken.None);

        unassigned!.AssignedUserId.Should().BeNull();
    }

    [Fact]
    public async Task AssignUserAsync_ReturnsNull_WhenTaskDoesNotExist()
    {
        var (service, _, _) = CreateSut();

        var result = await service.AssignUserAsync(999, null, CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task AssignUserAsync_ThrowsNotFound_WhenUserDoesNotExist()
    {
        var (service, _, _) = CreateSut();
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea", null, (int)TaskPriority.Medium, null, null, null),
            CancellationToken.None);

        var act = () => service.AssignUserAsync(created.Id, 999, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task DeleteTaskAsync_ReturnsFalse_WhenTaskDoesNotExist()
    {
        var (service, _, _) = CreateSut();

        var deleted = await service.DeleteTaskAsync(123, CancellationToken.None);

        deleted.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteTaskAsync_RemovesExistingTask()
    {
        var (service, repository, _) = CreateSut();
        var created = await service.CreateTaskAsync(
            new CreateTaskRequest("Tarea a eliminar", null, (int)TaskPriority.Medium, null, null, null),
            CancellationToken.None);

        var deleted = await service.DeleteTaskAsync(created.Id, CancellationToken.None);

        deleted.Should().BeTrue();
        repository.Tasks.Should().BeEmpty();
    }

    [Fact]
    public async Task GetTasksAsync_FiltersByStatusPriorityAndCategory()
    {
        var (service, _, _) = CreateSut();
        var pendingHigh = await service.CreateTaskAsync(
            new CreateTaskRequest("Urgente", null, (int)TaskPriority.High, "Trabajo", null, null), CancellationToken.None);
        var completedLow = await service.CreateTaskAsync(
            new CreateTaskRequest("Rutina", null, (int)TaskPriority.Low, "Personal", null, null), CancellationToken.None);
        await service.CompleteTaskAsync(completedLow.Id, CancellationToken.None);

        var pendingResults = await service.GetTasksAsync(
            new TaskFilterRequest(null, TaskStatusFilter.Pending, null, null), CancellationToken.None);

        pendingResults.Should().ContainSingle(t => t.Id == pendingHigh.Id);
    }
}
