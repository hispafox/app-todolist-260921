using FluentAssertions;
using TaskFlow.Application.Common;
using TaskFlow.Application.Tests.Fakes;
using TaskFlow.Application.Users;
using TaskFlow.Application.Users.Dtos;
using Xunit;

namespace TaskFlow.Application.Tests.Users;

public class UserServiceTests
{
    private static (UserService Service, InMemoryUserRepository Repository) CreateSut()
    {
        var repository = new InMemoryUserRepository();
        return (new UserService(repository), repository);
    }

    [Fact]
    public async Task CreateUserAsync_PersistsUser()
    {
        var (service, repository) = CreateSut();
        var request = new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62");

        var result = await service.CreateUserAsync(request, CancellationToken.None);

        result.Name.Should().Be("Ana García");
        repository.Users.Should().ContainSingle();
    }

    [Fact]
    public async Task CreateUserAsync_ThrowsConflict_WhenEmailAlreadyExists()
    {
        var (service, _) = CreateSut();
        await service.CreateUserAsync(new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62"), CancellationToken.None);

        var act = () => service.CreateUserAsync(new CreateUserRequest("Otra Ana", "ana@taskflow.dev", "#C97B3D"), CancellationToken.None);

        await act.Should().ThrowAsync<ConflictException>();
    }

    [Fact]
    public async Task GetUserByIdAsync_ReturnsNull_WhenUserDoesNotExist()
    {
        var (service, _) = CreateSut();

        var result = await service.GetUserByIdAsync(999, CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateUserAsync_UpdatesFields()
    {
        var (service, _) = CreateSut();
        var created = await service.CreateUserAsync(new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62"), CancellationToken.None);

        var updated = await service.UpdateUserAsync(
            created.Id,
            new UpdateUserRequest("Ana G.", "ana.g@taskflow.dev", "#C97B3D"),
            CancellationToken.None);

        updated!.Name.Should().Be("Ana G.");
        updated.Email.Should().Be("ana.g@taskflow.dev");
        updated.Color.Should().Be("#C97B3D");
    }

    [Fact]
    public async Task UpdateUserAsync_ReturnsNull_WhenUserDoesNotExist()
    {
        var (service, _) = CreateSut();

        var result = await service.UpdateUserAsync(999, new UpdateUserRequest("Nombre", "email@taskflow.dev", "#2F6F62"), CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateUserAsync_ThrowsConflict_WhenEmailBelongsToAnotherUser()
    {
        var (service, _) = CreateSut();
        await service.CreateUserAsync(new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62"), CancellationToken.None);
        var carlos = await service.CreateUserAsync(new CreateUserRequest("Carlos Pérez", "carlos@taskflow.dev", "#C97B3D"), CancellationToken.None);

        var act = () => service.UpdateUserAsync(carlos.Id, new UpdateUserRequest("Carlos Pérez", "ana@taskflow.dev", "#C97B3D"), CancellationToken.None);

        await act.Should().ThrowAsync<ConflictException>();
    }

    [Fact]
    public async Task UpdateUserAsync_AllowsKeepingOwnEmail()
    {
        var (service, _) = CreateSut();
        var created = await service.CreateUserAsync(new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62"), CancellationToken.None);

        var updated = await service.UpdateUserAsync(
            created.Id,
            new UpdateUserRequest("Ana García", "ana@taskflow.dev", "#C97B3D"),
            CancellationToken.None);

        updated!.Color.Should().Be("#C97B3D");
    }

    [Fact]
    public async Task DeleteUserAsync_RemovesExistingUser()
    {
        var (service, repository) = CreateSut();
        var created = await service.CreateUserAsync(new CreateUserRequest("Ana García", "ana@taskflow.dev", "#2F6F62"), CancellationToken.None);

        var deleted = await service.DeleteUserAsync(created.Id, CancellationToken.None);

        deleted.Should().BeTrue();
        repository.Users.Should().BeEmpty();
    }

    [Fact]
    public async Task DeleteUserAsync_ReturnsFalse_WhenUserDoesNotExist()
    {
        var (service, _) = CreateSut();

        var deleted = await service.DeleteUserAsync(999, CancellationToken.None);

        deleted.Should().BeFalse();
    }
}
