using SP.Application.Dtos.Store;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class StoreExtension
{
    public static StoreResponse ToDto(this Store store)
    {
        return new StoreResponse(
            store.Id,
            store.Name,
            store.Description,
            store.Website);
    }

    public static CreateStoreResponse ToCreateDto(this Store store)
    {
        return new CreateStoreResponse(
            store.Id);
    }

    public static Store ToEntity(this CreateStoreRequest request)
    {
        return new Store
        {
            Name = request.Name,
            Description = request.Description,
            Website = request.Website
        };
    }

    public static void ToEntity(this UpdateStoreRequest request, Store store)
    {
        store.Name = request.Name;
        store.Description = request.Description;
        store.Website = request.Website;
        store.UpdatedAt = DateTime.UtcNow;
    }
}