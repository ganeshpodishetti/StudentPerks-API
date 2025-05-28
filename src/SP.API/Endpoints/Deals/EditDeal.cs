using Microsoft.AspNetCore.Mvc;
using SP.API.Abstractions;
using SP.Application.Dtos.Deal;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Deals;

public class EditDeal : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals");

        route.MapPut("/{id:guid}",
                 async (IDeal dealService, Guid id, [FromBody] UpdateDealRequest request,
                     CancellationToken cancellationToken) =>
                 {
                     var deal = await dealService.UpdateDealAsync(id, request, cancellationToken);
                     return deal
                         ? Results.Ok(new { message = "Deal updated successfully" })
                         : Results.NotFound(new { message = "Deal with ID not found" });
                 })
             .WithTags("Deals");
    }
}