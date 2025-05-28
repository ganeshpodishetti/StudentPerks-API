namespace SP.API.Abstractions;

public interface IEndpoint
{
    void MapEndpoints(IEndpointRouteBuilder endpoints);
}