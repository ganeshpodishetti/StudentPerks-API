namespace SP.Application.Dtos.Store;

public record UpdateStoreRequest(
    string Name,
    string Description,
    string Website);