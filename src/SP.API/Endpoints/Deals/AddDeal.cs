using Microsoft.AspNetCore.Mvc;
using SP.API.Abstractions;
using SP.Application.Dtos.Deal;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Deals;

public class AddDeal : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals");

        route.MapPost("",
                 async (IDeal dealService, [FromBody] CreateDealRequest request, CancellationToken cancellationToken) =>
                 {
                     var deal = await dealService.CreateDealAsync(request, cancellationToken);
                     return Results.Created($"/api/deals/{deal.Id}", deal);
                 })
             .WithTags("Deals");
    }
}