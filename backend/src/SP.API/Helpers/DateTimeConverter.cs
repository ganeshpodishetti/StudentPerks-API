using System.Text.Json;
using System.Text.Json.Serialization;

namespace SP.API.Helpers;

public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    private const string DateFormat = "yyyy-MM-dd";

    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (string.IsNullOrEmpty(value))
            return default;

        if (DateOnly.TryParseExact(value, DateFormat, out var date))
            return date;

        // Try parsing the ISO date format and extract date part
        if (DateTime.TryParse(value, out var dateTime))
            return DateOnly.FromDateTime(dateTime);

        throw new FormatException($"Unable to parse '{value}' as DateOnly.");
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(DateFormat));
    }
}