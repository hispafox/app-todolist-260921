using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Application.Templates.Dtos;
using Xunit;

namespace TaskFlow.Api.Tests;

public class TemplateEndpointsTests : IClassFixture<TaskFlowApiFactory>, IAsyncLifetime
{
    private readonly TaskFlowApiFactory _factory;
    private HttpClient _client = null!;

    public TemplateEndpointsTests(TaskFlowApiFactory factory)
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
    public async Task TemplateEndpointsTests_GetTemplates_DevuelveListaVacia()
    {
        var response = await _client.GetAsync("/api/templates");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var templates = await response.Content.ReadFromJsonAsync<List<TaskTemplateDto>>();
        templates.Should().BeEmpty();
    }

    [Fact]
    public async Task TemplateEndpointsTests_PostTemplate_CreaPlantillaYDevuelve201()
    {
        var request = new CreateTaskTemplateRequest("Revisión semanal", "Repasar el estado de las tareas", 3, "Trabajo");

        var response = await _client.PostAsJsonAsync("/api/templates", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();

        var body = await response.Content.ReadFromJsonAsync<TaskTemplateDto>();
        body!.Title.Should().Be("Revisión semanal");
    }

    [Fact]
    public async Task TemplateEndpointsTests_PostTemplate_TituloVacioDevuelve400()
    {
        var request = new CreateTaskTemplateRequest(string.Empty, null, 2, null);

        var response = await _client.PostAsJsonAsync("/api/templates", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task TemplateEndpointsTests_PutTemplate_ActualizaYDevuelve200()
    {
        var created = await CreateTemplateAsync("Revisión semanal");

        var response = await _client.PutAsJsonAsync(
            $"/api/templates/{created.Id}",
            new UpdateTaskTemplateRequest("Revisión mensual", "Nueva descripción", 1, "Personal"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await response.Content.ReadFromJsonAsync<TaskTemplateDto>();
        updated!.Title.Should().Be("Revisión mensual");
    }

    [Fact]
    public async Task TemplateEndpointsTests_PutTemplate_InexistenteDevuelve404()
    {
        var response = await _client.PutAsJsonAsync(
            "/api/templates/999999",
            new UpdateTaskTemplateRequest("Título", null, 2, null));

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TemplateEndpointsTests_DeleteTemplate_EliminaYDevuelve204()
    {
        var created = await CreateTemplateAsync("Plantilla a eliminar");

        var deleteResponse = await _client.DeleteAsync($"/api/templates/{created.Id}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/templates/{created.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TemplateEndpointsTests_DeleteTemplate_InexistenteDevuelve404()
    {
        var response = await _client.DeleteAsync("/api/templates/999999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TemplateEndpointsTests_PostTaskFromTemplate_CreaTareaYDevuelve201()
    {
        var created = await CreateTemplateAsync("Revisión semanal");
        var dueDate = new DateTime(2026, 12, 1, 0, 0, 0, DateTimeKind.Utc);

        var response = await _client.PostAsJsonAsync(
            $"/api/templates/{created.Id}/tasks",
            new CreateTaskFromTemplateRequest(dueDate, null));

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var task = await response.Content.ReadFromJsonAsync<TaskDto>();
        task!.Title.Should().Be(created.Title);
        task.DueDate.Should().Be(dueDate);
    }

    [Fact]
    public async Task TemplateEndpointsTests_PostTaskFromTemplate_PlantillaInexistenteDevuelve404()
    {
        var response = await _client.PostAsJsonAsync(
            "/api/templates/999999/tasks",
            new CreateTaskFromTemplateRequest(null, null));

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TemplateEndpointsTests_PostTaskFromTemplate_UsuarioInexistenteDevuelve404()
    {
        var created = await CreateTemplateAsync("Revisión semanal");

        var response = await _client.PostAsJsonAsync(
            $"/api/templates/{created.Id}/tasks",
            new CreateTaskFromTemplateRequest(null, 999999));

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    private async Task<TaskTemplateDto> CreateTemplateAsync(string title)
    {
        var response = await _client.PostAsJsonAsync(
            "/api/templates",
            new CreateTaskTemplateRequest(title, null, 2, null));
        return (await response.Content.ReadFromJsonAsync<TaskTemplateDto>())!;
    }
}
