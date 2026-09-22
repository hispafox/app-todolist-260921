namespace TaskFlow.Domain.Entities;

public class AppUser
{
    public int Id { get; internal set; }
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Color { get; private set; } = string.Empty;

    // Requerido por EF Core.
    private AppUser()
    {
    }

    public AppUser(string name, string email, string color)
    {
        SetName(name);
        SetEmail(email);
        SetColor(color);
    }

    public void Update(string name, string email, string color)
    {
        SetName(name);
        SetEmail(email);
        SetColor(color);
    }

    private void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("El nombre es obligatorio.", nameof(name));
        }

        Name = name.Trim();
    }

    private void SetEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("El email es obligatorio.", nameof(email));
        }

        Email = email.Trim();
    }

    private void SetColor(string color)
    {
        if (string.IsNullOrWhiteSpace(color))
        {
            throw new ArgumentException("El color es obligatorio.", nameof(color));
        }

        Color = color.Trim();
    }
}
