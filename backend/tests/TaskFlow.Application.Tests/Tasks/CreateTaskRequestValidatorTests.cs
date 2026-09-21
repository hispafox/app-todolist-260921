using FluentAssertions;
using TaskFlow.Application.Tasks.Dtos;
using TaskFlow.Application.Tasks.Validators;
using Xunit;

namespace TaskFlow.Application.Tests.Tasks;

public class CreateTaskRequestValidatorTests
{
    private readonly CreateTaskRequestValidator _validator = new();

    [Fact]
    public void Validate_Fails_WhenTitleIsEmpty()
    {
        var request = new CreateTaskRequest(string.Empty, null, 2, null, null);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateTaskRequest.Title));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(4)]
    public void Validate_Fails_WhenPriorityIsOutOfRange(int priority)
    {
        var request = new CreateTaskRequest("Título válido", null, priority, null, null);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateTaskRequest.Priority));
    }

    [Fact]
    public void Validate_Succeeds_WithValidData()
    {
        var request = new CreateTaskRequest("Título válido", "Descripción", 2, "Personal", DateTime.UtcNow);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
