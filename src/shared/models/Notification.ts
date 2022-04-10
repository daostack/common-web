import { Time } from "@/shared/models/shared";

export interface NotificationItem {
  createdAt: Time;
  eventId: string;
  eventObjectId: string;
  eventType: string;

  userFilter: Array<string>;
}

export const EventTypeState = {
  creationReqToJoin: "creationReqToJoin",
  requestToJoinCreated: "requestToJoinCreated",
  requestToJoinExecuted: "requestToJoinExecuted",
  requestToJoinRejected: "requestToJoinRejected",
  requestToJoinAccepted: "requestToJoinAccepted",
  subscriptionPaymentConfirmed: "subscriptionPaymentConfirmed",
  subscriptionCanceledByUser: "subscriptionCanceledByUser",
  fundingRequestAccepted: "fundingRequestAccepted",
  fundingRequestCreated: "fundingRequestCreated",
  fundingRequestExecuted: "fundingRequestExecuted",
  fundingRequestRejected: "fundingRequestRejected",
  voteCreated: "voteCreated",
  cardCreated: "cardCreated",
  paymentFailed: "paymentFailed",
  messageCreated: "messageCreated",
  commonCreated: "commonCreated",
  commonWhitelisted: "commonWhitelisted",
  commonMemberAdded: "commonMemberAdded",
  welcomeNotification: "welcomeNotification",
  discussionCreated: "discussionCreated",
  discussionMessageReported: "discussionMessageReported",
  proposalReported: "proposalReported",
  discussionReported: "discussionReported",
  membershipRequestReported: "membershipRequestReported",
};

export const EventTitleState = {
  creationReqToJoin: "Request To Join Created",
  requestToJoinCreated: "New Members",
  requestToJoinExecuted: "Request To Join Executed",
  requestToJoinAccepted: "Membership Approved",
  requestToJoinRejected: "Membership Rejected",
  subscriptionPaymentConfirmed: "Subscription Payment Confirmed",
  subscriptionCanceledByUser: "Subscription Canceled By User",
  fundingRequestAccepted: "YAY!  Your proposal \n" + "Is Approved",
  fundingRequestCreated: "New Proposal",
  fundingRequestExecuted: "Proposal Executed",
  fundingRequestRejected: "Oh! Your Proposal Was Declined",
  cardCreated: "Card Created",
  voteCreated: "Vote Created",
  paymentFailed: "Payment Failed",
  messageCreated: "New Comment",
  commonCreated: "Common Created",
  commonWhitelisted: "New Featured Common",
  commonMemberAdded: "Membership Approved",
  welcomeNotification: "Welcome to Common!",
  discussionCreated: "New post",
  discussionMessageReported: "Comment Reported",
  proposalReported: "Proposal Reported",
  discussionReported: "Post Reported",
  membershipRequestReported: "Membership Request Reported",
};
