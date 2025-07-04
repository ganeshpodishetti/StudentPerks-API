using System.Text.Json;
using System.Text.Json.Serialization;

namespace SP.API.Helpers;

public static class DateTimeConverter
{
    // Custom DateTime converter to ensure UTC
    public class UtcDateTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var dateTimeString = reader.GetString();
            if (string.IsNullOrEmpty(dateTimeString))
                return default;

            if (!DateTime.TryParse(dateTimeString, out var dateTime))
                throw new FormatException($"Unable to parse '{dateTimeString}' as DateTime.");
            // If it's already UTC, return as is
            return dateTime.Kind == DateTimeKind.Utc
                ? dateTime
                : DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            // Always write as UTC ISO string
            var utcDateTime = value.Kind == DateTimeKind.Utc ? value : value.ToUniversalTime();
            writer.WriteStringValue(utcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"));
        }
    }

    // Also add nullable DateTime converter
    public class UtcNullableDateTimeConverter : JsonConverter<DateTime?>
    {
        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var dateTimeString = reader.GetString();
            if (string.IsNullOrEmpty(dateTimeString))
                return null;

            if (!DateTime.TryParse(dateTimeString, out var dateTime)) return null;
            // If it's already UTC, return as is
            return dateTime.Kind == DateTimeKind.Utc
                ? dateTime
                : DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        }

        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
        {
            if (value.HasValue)
            {
                // Always write as UTC ISO string
                var utcDateTime = value.Value.Kind == DateTimeKind.Utc ? value.Value : value.Value.ToUniversalTime();
                writer.WriteStringValue(utcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"));
            }
            else
            {
                writer.WriteNullValue();
            }
        }
    }
}