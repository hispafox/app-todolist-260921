using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using TaskFlow.Application.Users.Dtos;
using Xunit;

namespace TaskFlow.Api.Tests;

public class UserEndpointsTests : IClassFixture<TaskFlowApiFactory>, IAsyncLifetime
{
    private readonly TaskFlowApiFactory _factory;
    private HttpClient _client = null!;

    public UserEndpointsTests(TaskFlowApiFactory factory)
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
    public async Task CreateUser_ReturnsCreated_WithLocationAndBody()
    {
        var request = new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62");

        var response = await _client.PostAsJsonAsync("/api/users", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();

        var body = await response.Content.ReadFromJsonAsync<UserDto>();
        body!.Name.Should().Be("Ana García");
    }

    [Fact]
    public async Task CreateUser_ReturnsValidationProblem_WhenEmailIsInvalid()
    {
        var request = new CreateUserRequest("Ana García", "no-es-un-email", "#2F6F62");

        var response = await _client.PostAsJsonAsync("/api/users", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateUser_ReturnsConflict_WhenEmailAlreadyExists()
    {
        await _client.PostAsJsonAsync("/api/users", new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62"));

        var response = await _client.PostAsJsonAsync("/api/users", new CreateUserRequest("Otra Ana", "ana@taskflow.dev", "#C97B3D"));

        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task GetUserById_ReturnsNotFound_WhenUserDoesNotExist()
    {
        var response = await _client.GetAsync("/api/users/999999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteUser_RemovesUser_AndSubsequentGetReturnsNotFound()
    {
        var created = await CreateUserAsync("Carlos Pérez", "carlos@taskflow.dev");

        var deleteResponse = await _client.DeleteAsync($"/api/users/{created.Id}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/users/{created.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    private async Task<UserDto> CreateUserAsync(string name, string email)
    {
        var response = await _client.PostAsJsonAsync("/api/users", new CreateUserRequest(name, email, "#2F6F62"));
        return (await response.Content.ReadFromJsonAsync<UserDto>())!;
    }
}
