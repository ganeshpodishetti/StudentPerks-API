export interface SubmittedDeal {
  id: string;
  name: string;
  url: string;
  markedAsRead: boolean;
  sentAt: string;
}

export interface SubmitDealRequest {
  name: string;
  url: string;
}

export interface MarkAsReadDealRequest {
  markedAsRead: boolean;
}

export interface SubmittedDealResponse {
  id: string;
  name: string;
  url: string;
  markedAsRead: boolean;
  sentAt: string;
}
