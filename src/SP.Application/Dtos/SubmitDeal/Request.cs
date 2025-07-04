namespace SP.Application.Dtos.SubmitDeal;

public record SubmitDealRequest(
    string Name,
    string Url);

public record MarkAsReadDealRequest(
    bool MarkedAsRead);