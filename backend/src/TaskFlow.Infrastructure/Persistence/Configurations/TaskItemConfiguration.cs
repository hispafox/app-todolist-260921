using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Infrastructure.Persistence.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("Tasks");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(t => t.Description)
            .HasMaxLength(500);

        builder.Property(t => t.Category)
            .HasMaxLength(40);

        builder.Property(t => t.Priority)
            .IsRequired();

        builder.Property(t => t.IsCompleted)
            .IsRequired();

        builder.Property(t => t.CreatedAt)
            .IsRequired();

        builder.Property(t => t.UpdatedAt)
            .IsRequired();

        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(t => t.AssignedUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(t => t.IsCompleted);
        builder.HasIndex(t => t.Priority);
        builder.HasIndex(t => t.Category);
        builder.HasIndex(t => t.AssignedUserId);
    }
}
