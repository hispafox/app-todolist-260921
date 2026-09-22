using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Application.Users.Dtos;
using Xunit;

namespace TaskFlow.Api.Tests;

public class TaskEndpointsTests : IClassFixture<TaskFlowApiFactory>, IAsyncLifetime
{
    private readonly TaskFlowApiFactory _factory;
    private HttpClient _client = null!;

    public TaskEndpointsTests(TaskFlowApiFactory factory)
    {
        _factory = factory;
    }

    public async Task InitializeAsync()
    {
        _client = _factory.CreateClient();
        await _factory.ResetDatabaseAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task CreateTask_ReturnsCreated_WithLocationAndBody()
    {
        var request = new CreateTaskRequest("Preparar demo", "Repasar el flujo completo", 3, "Formación", null, null);

        var response = await _client.PostAsJsonAsync("/api/tasks", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();

        var body = await response.Content.ReadFromJsonAsync<TaskDto>();
        body!.Title.Should().Be("Preparar demo");
        body.IsCompleted.Should().BeFalse();
    }

    [Fact]
    public async Task CreateTask_ReturnsValidationProblem_WhenTitleIsMissing()
    {
        var request = new CreateTaskRequest(string.Empty, null, 2, null, null, null);

        var response = await _client.PostAsJsonAsync("/api/tasks", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetTaskById_ReturnsNotFound_WhenTaskDoesNotExist()
    {
        var response = await _client.GetAsync("/api/tasks/999999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CompleteThenReopen_TogglesTaskStatus()
    {
        var created = await CreateTaskAsync("Tarea con ciclo completo");

        var completeResponse = await _client.PatchAsync($"/api/tasks/{created.Id}/complete", content: null);
        completeResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var completed = await completeResponse.Content.ReadFromJsonAsync<TaskDto>();
        completed!.IsCompleted.Should().BeTrue();

        var reopenResponse = await _client.PatchAsync($"/api/tasks/{created.Id}/reopen", content: null);
        reopenResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var reopened = await reopenResponse.Content.ReadFromJsonAsync<TaskDto>();
        reopened!.IsCompleted.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteTask_RemovesTask_AndSubsequentGetReturnsNotFound()
    {
        var created = await CreateTaskAsync("Tarea a eliminar");

        var deleteResponse = await _client.DeleteAsync($"/api/tasks/{created.Id}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/tasks/{created.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetTasks_FiltersByStatus()
    {
        var pending = await CreateTaskAsync("Tarea pendiente");
        var completed = await CreateTaskAsync("Tarea completada");
        await _client.PatchAsync($"/api/tasks/{completed.Id}/complete", content: null);

        var response = await _client.GetAsync("/api/tasks?status=pending");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskDto>>();
        tasks.Should().ContainSingle(t => t.Id == pending.Id);
        tasks.Should().NotContain(t => t.Id == completed.Id);
    }

    [Fact]
    public async Task AssignUser_SetsAssignedUserId_WhenUserExists()
    {
        var userResponse = await _client.PostAsJsonAsync("/api/users", new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62"));
        var user = await userResponse.Content.ReadFromJsonAsync<UserDto>();
        var task = await CreateTaskAsync("Tarea a asignar");

        var response = await _client.PatchAsJsonAsync($"/api/tasks/{task.Id}/assign", new AssignTaskRequest(user!.Id));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<TaskDto>();
        body!.AssignedUserId.Should().Be(user.Id);
    }

    [Fact]
    public async Task AssignUser_ReturnsNotFound_WhenUserDoesNotExist()
    {
        var task = await CreateTaskAsync("Tarea a asignar");

        var response = await _client.PatchAsJsonAsync($"/api/tasks/{task.Id}/assign", new AssignTaskRequest(999));

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    private async Task<TaskDto> CreateTaskAsync(string title)
    {
        var response = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskRequest(title, null, 2, null, null, null));
        return (await response.Content.ReadFromJsonAsync<TaskDto>())!;
    }
}
