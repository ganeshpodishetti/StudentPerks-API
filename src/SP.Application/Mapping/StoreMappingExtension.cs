using SP.Application.Dtos.Store;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class StoreMappingExtension
{
    public static StoreResponse ToDto(this Store store)
    {
        return new StoreResponse(
            store.Id,
            store.Name,
            store.Description,
            store.Website);
    }

    public static Store ToEntity(this CreateStoreRequest request)
    {
        return new Store
        {
            Name = request.Name.ToLower(),
            Description = request.Description,
            Website = request.Website
        };
    }

    public static void ToEntity(this UpdateStoreRequest request, Store store)
    {
        store.Name = request.Name.ToLower();
        store.Description = request.Description;
        store.Website = request.Website;
        store.UpdatedAt = DateTime.UtcNow;
    }
}