namespace SP.Application.Dtos.SubmitDeal;

public record SubmittedDealResponse(
    Guid Id,
    string Name,
    string Url,
    bool MarkedAsRead,
    DateTime SentAt);