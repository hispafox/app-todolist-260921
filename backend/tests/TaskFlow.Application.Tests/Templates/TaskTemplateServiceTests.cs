using FluentAssertions;
using TaskFlow.Application.Templates;
using TaskFlow.Application.Templates.Dtos;
using TaskFlow.Application.Tests.Fakes;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;
using Xunit;

namespace TaskFlow.Application.Tests.Templates;

public class TaskTemplateServiceTests
{
    private static (TaskTemplateService Service, InMemoryTaskTemplateRepository Repository) CreateSut()
    {
        var repository = new InMemoryTaskTemplateRepository();
        return (new TaskTemplateService(repository), repository);
    }

    [Fact]
    public void TaskTemplateTest_TituloVacioLanzaExcepcion()
    {
        var act = () => new TaskTemplate("   ", null, TaskPriority.Medium, null);

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void TaskTemplateTest_ActualizaCamposCorrectamente()
    {
        var template = new TaskTemplate("Revisión semanal", "Descripción original", TaskPriority.Low, "Trabajo");

        template.Update("Revisión mensual", "Descripción nueva", TaskPriority.High, "Personal");

        template.Title.Should().Be("Revisión mensual");
        template.Description.Should().Be("Descripción nueva");
        template.Priority.Should().Be(TaskPriority.High);
        template.Category.Should().Be("Personal");
    }

    [Fact]
    public async Task TaskTemplateServiceTest_CreaPlantillaCorrectamente()
    {
        var (service, repository) = CreateSut();
        var request = new CreateTaskTemplateRequest("Revisión semanal", "Repasar el estado de las tareas", (int)TaskPriority.High, "Trabajo");

        var result = await service.CreateTemplateAsync(request, CancellationToken.None);

        result.Title.Should().Be("Revisión semanal");
        result.Priority.Should().Be((int)TaskPriority.High);
        repository.Templates.Should().ContainSingle();
    }

    [Fact]
    public async Task TaskTemplateServiceTest_ActualizaPlantillaExistente()
    {
        var (service, _) = CreateSut();
        var created = await service.CreateTemplateAsync(
            new CreateTaskTemplateRequest("Revisión semanal", null, (int)TaskPriority.Medium, null),
            CancellationToken.None);

        var updated = await service.UpdateTemplateAsync(
            created.Id,
            new UpdateTaskTemplateRequest("Revisión mensual", "Nueva descripción", (int)TaskPriority.High, "Personal"),
            CancellationToken.None);

        updated!.Title.Should().Be("Revisión mensual");
        updated.Description.Should().Be("Nueva descripción");
        updated.Priority.Should().Be((int)TaskPriority.High);
        updated.Category.Should().Be("Personal");
    }

    [Fact]
    public async Task TaskTemplateServiceTest_ActualizarPlantillaInexistenteDevuelveNull()
    {
        var (service, _) = CreateSut();

        var result = await service.UpdateTemplateAsync(
            999,
            new UpdateTaskTemplateRequest("Título", null, (int)TaskPriority.Medium, null),
            CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task TaskTemplateServiceTest_EliminaPlantillaExistente()
    {
        var (service, repository) = CreateSut();
        var created = await service.CreateTemplateAsync(
            new CreateTaskTemplateRequest("Revisión semanal", null, (int)TaskPriority.Medium, null),
            CancellationToken.None);

        var deleted = await service.DeleteTemplateAsync(created.Id, CancellationToken.None);

        deleted.Should().BeTrue();
        repository.Templates.Should().BeEmpty();
    }

    [Fact]
    public async Task TaskTemplateServiceTest_EliminarPlantillaInexistenteDevuelveFalse()
    {
        var (service, _) = CreateSut();

        var deleted = await service.DeleteTemplateAsync(999, CancellationToken.None);

        deleted.Should().BeFalse();
    }
}
