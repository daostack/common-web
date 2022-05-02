import { Time } from "@/shared/models/shared";

export interface NotificationItem {
  createdAt: Time;
  eventId: string;
  eventObjectId: string;
  eventType: EventTypeState;

  userFilter: Array<string>;
  seen: Array<string>;
}

export enum EventTypeState {
  creationReqToJoin = "creationReqToJoin",
  requestToJoinCreated = "requestToJoinCreated",
  requestToJoinExecuted = "requestToJoinExecuted",
  requestToJoinRejected = "requestToJoinRejected",
  requestToJoinAccepted = "requestToJoinAccepted",
  subscriptionPaymentConfirmed = "subscriptionPaymentConfirmed",
  subscriptionCanceledByUser = "subscriptionCanceledByUser",
  fundingRequestAccepted = "fundingRequestAccepted",
  fundingRequestCreated = "fundingRequestCreated",
  fundingRequestExecuted = "fundingRequestExecuted",
  fundingRequestRejected = "fundingRequestRejected",
  voteCreated = "voteCreated",
  cardCreated = "cardCreated",
  paymentFailed = "paymentFailed",
  messageCreated = "messageCreated",
  commonCreated = "commonCreated",
  commonWhitelisted = "commonWhitelisted",
  commonMemberAdded = "commonMemberAdded",
  welcomeNotification = "welcomeNotification",
  discussionCreated = "discussionCreated",
  discussionMessageReported = "discussionMessageReported",
  proposalReported = "proposalReported",
  discussionReported = "discussionReported",
  membershipRequestReported = "membershipRequestReported",
}

export const EVENT_TITLE_STATES: Record<EventTypeState, string> = {
  [EventTypeState.creationReqToJoin]: "Request To Join Created",
  [EventTypeState.requestToJoinCreated]: "New Members",
  [EventTypeState.requestToJoinExecuted]: "Request To Join Executed",
  [EventTypeState.requestToJoinAccepted]: "Membership Approved",
  [EventTypeState.requestToJoinRejected]: "Membership Rejected",
  [EventTypeState.subscriptionPaymentConfirmed]:
    "Subscription Payment Confirmed",
  [EventTypeState.subscriptionCanceledByUser]: "Subscription Canceled By User",
  [EventTypeState.fundingRequestAccepted]: "YAY!  Your proposal Is Approved",
  [EventTypeState.fundingRequestCreated]: "New Proposal",
  [EventTypeState.fundingRequestExecuted]: "Proposal Executed",
  [EventTypeState.fundingRequestRejected]: "Oh! Your Proposal Was Declined",
  [EventTypeState.cardCreated]: "Card Created",
  [EventTypeState.voteCreated]: "Vote Created",
  [EventTypeState.paymentFailed]: "Payment Failed",
  [EventTypeState.messageCreated]: "New Comment",
  [EventTypeState.commonCreated]: "Common Created",
  [EventTypeState.commonWhitelisted]: "New Featured Common",
  [EventTypeState.commonMemberAdded]: "Membership Approved",
  [EventTypeState.welcomeNotification]: "Welcome to Common!",
  [EventTypeState.discussionCreated]: "New post",
  [EventTypeState.discussionMessageReported]: "Comment Reported",
  [EventTypeState.proposalReported]: "Proposal Reported",
  [EventTypeState.discussionReported]: "Post Reported",
  [EventTypeState.membershipRequestReported]: "Membership Request Reported",
};
