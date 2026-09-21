using TaskFlow.Application.Common;

namespace TaskFlow.Application.Tests.Fakes;

public class FixedDateTimeProvider : IDateTimeProvider
{
    public FixedDateTimeProvider(DateTime utcNow) => UtcNow = utcNow;

    public DateTime UtcNow { get; set; }
}
