namespace SP.Domain.Entities;

public class SubmitDeal : Base
{
    public required string Url { get; set; }
    public bool MarkedAsRead { get; set; }
}