using SP.Application.Dtos.Store;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class StoreMappingExtension
{
    public static StoreResponse ToDto(this Store store)
    {
        return new StoreResponse(
            store.StoreId,
            store.Name,
            store.Description,
            store.Website);
    }
}