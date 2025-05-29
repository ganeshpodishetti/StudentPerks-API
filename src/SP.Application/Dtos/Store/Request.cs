namespace SP.Application.Dtos.Store;

public record UpdateStoreRequest(
    string Name,
    string? Description,
    string? Website);

public record CreateStoreRequest(
    string Name,
    string? Description,
    string? Website);