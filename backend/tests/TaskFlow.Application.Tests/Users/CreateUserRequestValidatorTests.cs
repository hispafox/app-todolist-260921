using FluentAssertions;
using TaskFlow.Application.Users.Dtos;
using TaskFlow.Application.Users.Validators;
using Xunit;

namespace TaskFlow.Application.Tests.Users;

public class CreateUserRequestValidatorTests
{
    private readonly CreateUserRequestValidator _validator = new();

    [Fact]
    public void Validate_Fails_WhenNameIsEmpty()
    {
        var request = new CreateUserRequest(string.Empty, "ana@taskflow.dev", "#2F6F62");

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateUserRequest.Name));
    }

    [Theory]
    [InlineData("no-es-un-email")]
    [InlineData("")]
    public void Validate_Fails_WhenEmailIsInvalid(string email)
    {
        var request = new CreateUserRequest("Ana García", email, "#2F6F62");

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateUserRequest.Email));
    }

    [Theory]
    [InlineData("teal")]
    [InlineData("#ZZZZZZ")]
    [InlineData("")]
    public void Validate_Fails_WhenColorIsNotHex(string color)
    {
        var request = new CreateUserRequest("Ana García", "ana@taskflow.dev", color);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateUserRequest.Color));
    }

    [Fact]
    public void Validate_Succeeds_WithValidData()
    {
        var request = new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62");

        var result = _validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
