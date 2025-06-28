namespace SP.Application.Dtos.Store;

public record StoreResponse(
    Guid Id,
    string? Name,
    string? Description,
    string? Website);

public record CreateStoreResponse(
    Guid Id);