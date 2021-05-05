import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: any;
  Void: any;
};


export type User = {
  __typename?: 'User';
  /** The system Id of the user */
  id: Scalars['ID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  /** The first name of the user */
  firstName: Scalars['String'];
  /** The last name of the user */
  lastName: Scalars['String'];
  /** The display name of the user */
  displayName: Scalars['String'];
  photo: Scalars['String'];
  /** The email of the user */
  email: Scalars['String'];
  /** List of all the users permissions */
  permissions: Array<Scalars['String']>;
  /** List of events, that occurred and are related to this user */
  events: Array<Event>;
  proposals: Array<Proposal>;
  notifications: Array<Notification>;
  notificationTokens: Array<UserNotificationToken>;
  discussionSubscriptions: Array<DiscussionSubscription>;
};


export type UserEventsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EventOrderByInput>;
};


export type UserProposalsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<ProposalWhereInput>;
};


export type UserNotificationsArgs = {
  orderBy?: Maybe<NotificationOrderByInput>;
  cursor?: Maybe<NotificationWhereUniqueInput>;
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type UserDiscussionSubscriptionsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DiscussionSubscriptionOrderByInput>;
};

export type UserNotificationToken = BaseEntity & {
  __typename?: 'UserNotificationToken';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  state: UserNotificationTokenState;
  token: Scalars['String'];
  description: Scalars['String'];
  lastUsed: Scalars['DateTime'];
  lastVerified: Scalars['DateTime'];
};

export type CreateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  photo: Scalars['String'];
};

export type CreateUserNotificationTokenInput = {
  token: Scalars['String'];
  description: Scalars['String'];
};

export enum UserNotificationTokenState {
  Active = 'Active',
  Expired = 'Expired',
  Voided = 'Voided'
}

export type Role = BaseEntity & {
  __typename?: 'Role';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  description: Scalars['String'];
  permissions: Array<Scalars['String']>;
};

export type Card = {
  __typename?: 'Card';
  /** The main identifier of the item */
  id: Scalars['ID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
};

export type CreateCardInput = {
  /** The ID of the key used for the encryption of the sensitive data */
  keyId: Scalars['String'];
  /** The sensitive part of the card as encrypted card */
  encryptedData: Scalars['String'];
  expYear: Scalars['Int'];
  expMonth: Scalars['Int'];
  billingDetails: BillingDetailsInput;
};

export type Vote = {
  __typename?: 'Vote';
  /** The main identifier of the item */
  id: Scalars['ID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  outcome: VoteOutcome;
  voterId: Scalars['ID'];
  voter: CommonMember;
};

export enum VoteOutcome {
  Approve = 'Approve',
  Condemn = 'Condemn'
}

export type CreateVoteInput = {
  outcome: VoteOutcome;
  /** The ID of the root of the proposal whether it is funding one or join */
  proposalId: Scalars['ID'];
};

export type Event = {
  __typename?: 'Event';
  /** The main identifier of the item */
  id: Scalars['ID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  /** The type of the event in one of the predefined event types */
  type: EventType;
  payload?: Maybe<Scalars['JSON']>;
  /** The ID of the common, for whom the event was created */
  commonId?: Maybe<Scalars['ID']>;
  /** The ID of the event creator */
  userId?: Maybe<Scalars['ID']>;
  /** The event creator */
  user?: Maybe<User>;
};

export enum EventType {
  CommonCreated = 'CommonCreated',
  CommonDelisted = 'CommonDelisted',
  CommonWhitelisted = 'CommonWhitelisted',
  CommonMemberCreated = 'CommonMemberCreated',
  CommonMemberRoleAdded = 'CommonMemberRoleAdded',
  CommonMemberRoleRemoved = 'CommonMemberRoleRemoved',
  JoinRequestCreated = 'JoinRequestCreated',
  JoinRequestAccepted = 'JoinRequestAccepted',
  JoinRequestRejected = 'JoinRequestRejected',
  FundingRequestCreated = 'FundingRequestCreated',
  FundingRequestAccepted = 'FundingRequestAccepted',
  FundingRequestRejected = 'FundingRequestRejected',
  CardCreated = 'CardCreated',
  CardCvvVerificationPassed = 'CardCvvVerificationPassed',
  CardCvvVerificationFailed = 'CardCvvVerificationFailed',
  PaymentCreated = 'PaymentCreated',
  PaymentSucceeded = 'PaymentSucceeded',
  PaymentFailed = 'PaymentFailed',
  ProposalMajorityReached = 'ProposalMajorityReached',
  ProposalExpired = 'ProposalExpired',
  VoteCreated = 'VoteCreated',
  UserCreated = 'UserCreated',
  DiscussionCreated = 'DiscussionCreated',
  DiscussionMessageCreated = 'DiscussionMessageCreated',
  DiscussionSubscriptionCreated = 'DiscussionSubscriptionCreated',
  DiscussionSubscriptionTypeChanged = 'DiscussionSubscriptionTypeChanged',
  NotificationTemplateCreated = 'NotificationTemplateCreated',
  NotificationTemplateUpdated = 'NotificationTemplateUpdated',
  UserNotificationTokenVoided = 'UserNotificationTokenVoided',
  UserNotificationTokenExpired = 'UserNotificationTokenExpired',
  UserNotificationTokenCreated = 'UserNotificationTokenCreated',
  UserNotificationTokenRefreshed = 'UserNotificationTokenRefreshed',
  ReportCreated = 'ReportCreated',
  ReportRespected = 'ReportRespected',
  ReportDismissed = 'ReportDismissed',
  RoleCreated = 'RoleCreated',
  RoleUpdated = 'RoleUpdated',
  RolePermissionAdded = 'RolePermissionAdded',
  RolePermissionRemoved = 'RolePermissionRemoved',
  RoleDeleted = 'RoleDeleted',
  UserAddedToRole = 'UserAddedToRole',
  UserRemovedFromRole = 'UserRemovedFromRole'
}

export type EventOrderByInput = {
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  type?: Maybe<SortOrder>;
};

export type Common = {
  __typename?: 'Common';
  /** The main identifier of the item */
  id: Scalars['ID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  /** The name of the common as provided */
  name: Scalars['String'];
  /** The whitelisting state of a common */
  whitelisted: Scalars['Boolean'];
  /** The current available funds of the common. In cents */
  balance: Scalars['Int'];
  /** The total amount of money that the common has raised. In cents */
  raised: Scalars['Int'];
  image: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  action?: Maybe<Scalars['String']>;
  byline?: Maybe<Scalars['String']>;
  fundingType: FundingType;
  /** The minimum amount that the join request should provide. In cents */
  fundingMinimumAmount: Scalars['Int'];
  /** List of events, that occurred in a common */
  events: Array<Event>;
  reports: Array<Report>;
  proposals: Array<Proposal>;
  discussions: Array<Discussion>;
  members: Array<Maybe<CommonMember>>;
  activeProposals: Scalars['Int'];
  activeFundingProposals: Scalars['Int'];
  activeJoinProposals: Scalars['Int'];
};


export type CommonEventsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EventOrderByInput>;
};


export type CommonReportsArgs = {
  where?: Maybe<ReportWhereInput>;
};


export type CommonProposalsArgs = {
  paginate?: Maybe<PaginateInput>;
  where?: Maybe<ProposalWhereInput>;
};


export type CommonDiscussionsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type CommonMembersArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CommonMemberOrderByInput>;
};

/** The funding type of the common */
export enum FundingType {
  OneTime = 'OneTime',
  Monthly = 'Monthly'
}

export type CreateCommonInput = {
  name: Scalars['String'];
  fundingMinimumAmount: Scalars['Int'];
  fundingType: FundingType;
  image: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  action?: Maybe<Scalars['String']>;
  byline?: Maybe<Scalars['String']>;
};

export type CommonWhereUniqueInput = {
  id: Scalars['ID'];
};

export type Report = BaseEntity & {
  __typename?: 'Report';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  /** The current status of the report */
  status: ReportStatus;
  /** The type of violation that this report is for */
  for: ReportFor;
  /** The note that the report has left for the content */
  note: Scalars['String'];
  /** The date on which the report was last reviewed if reviewed */
  reviewedOn?: Maybe<Scalars['DateTime']>;
  reporterId: Scalars['ID'];
  reporter: User;
  messageId: Scalars['UUID'];
  message: DiscussionMessage;
};

export enum ReportFor {
  Nudity = 'Nudity',
  Violance = 'Violance',
  Harassment = 'Harassment',
  FalseNews = 'FalseNews',
  Spam = 'Spam',
  Hate = 'Hate',
  Other = 'Other'
}

export enum ReportAction {
  Respected = 'Respected',
  Dismissed = 'Dismissed'
}

export enum ReportStatus {
  Active = 'Active',
  Clossed = 'Clossed'
}

export enum ReportAuditor {
  CommonModerator = 'CommonModerator',
  SystemAdmin = 'SystemAdmin'
}

export type ReportWhereInput = {
  status?: Maybe<ReportStatusFilterInput>;
  for?: Maybe<ReportFor>;
};

export type ReportStatusFilterInput = {
  in?: Maybe<Array<Maybe<ReportStatus>>>;
  not?: Maybe<Array<Maybe<ReportStatus>>>;
};

export type ActOnReportInput = {
  reportId: Scalars['UUID'];
  action: ReportAction;
};

export type ReportDiscussionMessageInput = {
  messageId: Scalars['UUID'];
  note: Scalars['String'];
  for: ReportFor;
};

export type Proposal = {
  __typename?: 'Proposal';
  /** The main identifier of the item */
  id: Scalars['ID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  type: ProposalType;
  state: ProposalState;
  links?: Maybe<Scalars['JSON']>;
  files?: Maybe<Scalars['JSON']>;
  images?: Maybe<Scalars['JSON']>;
  votesFor: Scalars['Int'];
  votesAgainst: Scalars['Int'];
  expiresAt: Scalars['DateTime'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  /** The IP from which the proposal was created */
  ipAddress?: Maybe<Scalars['String']>;
  discussions: Array<Discussion>;
  /** The ID of the user who created the proposal */
  userId: Scalars['ID'];
  /** The ID of the membership of the user who created the proposal */
  commonMemberId: Scalars['UUID'];
  user: User;
  member: CommonMember;
  fundingId?: Maybe<Scalars['UUID']>;
  funding?: Maybe<FundingProposal>;
  commonId: Scalars['UUID'];
  common: Common;
  votes: Array<Vote>;
  joinId?: Maybe<Scalars['UUID']>;
  join?: Maybe<JoinProposal>;
};


export type ProposalDiscussionsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};

export type JoinProposal = BaseEntity & {
  __typename?: 'JoinProposal';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  /** The amount that this join proposal will contribute to the common. In cents */
  funding: Scalars['Int'];
  fundingType: FundingType;
  paymentState: PaymentState;
};

export type FundingProposal = BaseEntity & {
  __typename?: 'FundingProposal';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  /** The amount that the proposal has requested in cents */
  amount: Scalars['Int'];
  fundingState: FundingState;
};

export type ProposalWhereInput = {
  type?: Maybe<ProposalType>;
  state?: Maybe<ProposalState>;
  commonId?: Maybe<Scalars['UUID']>;
  commonMemberId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['ID']>;
};

export type CreateJoinProposalInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  fundingAmount: Scalars['Int'];
  cardId: Scalars['String'];
  commonId: Scalars['String'];
  links?: Maybe<Array<LinkInput>>;
};

export type CreateFundingProposalInput = {
  commonId: Scalars['ID'];
  amount: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  links?: Maybe<Array<ProposalLinkInput>>;
  files?: Maybe<Array<ProposalFileInput>>;
  images?: Maybe<Array<ProposalImageInput>>;
};

export type ProposalLinkInput = {
  title: Scalars['String'];
  url: Scalars['String'];
};

export type ProposalFileInput = {
  value: Scalars['String'];
};

export type ProposalImageInput = {
  value: Scalars['String'];
};

export enum ProposalType {
  FundingRequest = 'FundingRequest',
  JoinRequest = 'JoinRequest'
}

export enum ProposalState {
  Countdown = 'Countdown',
  Finalizing = 'Finalizing',
  Rejected = 'Rejected',
  Accepted = 'Accepted'
}

export enum FundingState {
  NotEligible = 'NotEligible',
  Eligible = 'Eligible',
  AwaitingApproval = 'AwaitingApproval',
  Pending = 'Pending',
  Completed = 'Completed',
  Confirmed = 'Confirmed'
}

export enum PaymentState {
  NotAttempted = 'NotAttempted',
  Pending = 'Pending',
  Successful = 'Successful',
  Unsuccessful = 'Unsuccessful'
}

export type ProposalWhereUniqueInput = {
  id: Scalars['UUID'];
};

export enum StatisticType {
  AllTime = 'AllTime',
  Hourly = 'Hourly',
  Daily = 'Daily',
  Weekly = 'Weekly'
}

export type Statistic = BaseEntity & {
  __typename?: 'Statistic';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  users: Scalars['Int'];
  commons: Scalars['Int'];
  fundingProposals: Scalars['Int'];
  joinProposals: Scalars['Int'];
};

export type StatisticsWhereInput = {
  type?: Maybe<StatisticType>;
};

export type Discussion = BaseEntity & {
  __typename?: 'Discussion';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  /** What this discussion is about */
  topic: Scalars['String'];
  /** Short description of the topic */
  description: Scalars['String'];
  /** The date at which the last message on the discussion was added */
  latestMessage: Scalars['DateTime'];
  type: DiscussionType;
  messages: Array<DiscussionMessage>;
};


export type DiscussionMessagesArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DiscussionMessagesOrderByInput>;
};

export type DiscussionMessage = BaseEntity & {
  __typename?: 'DiscussionMessage';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  message: Scalars['String'];
  type: DiscussionMessageType;
  flag: DiscussionMessageFlag;
  reports: Array<Report>;
};

export type DiscussionSubscription = BaseEntity & {
  __typename?: 'DiscussionSubscription';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  type: DiscussionSubscriptionType;
  userId: Scalars['String'];
  discussionId: Scalars['UUID'];
  discussion: Discussion;
};

export enum DiscussionType {
  ProposalDiscussion = 'ProposalDiscussion',
  CommonDiscussion = 'CommonDiscussion'
}

export enum DiscussionMessageType {
  Message = 'Message'
}

export enum DiscussionMessageFlag {
  Clear = 'Clear',
  Reported = 'Reported',
  Hidden = 'Hidden'
}

export enum DiscussionSubscriptionType {
  AllNotifications = 'AllNotifications',
  OnlyMentions = 'OnlyMentions',
  NoNotification = 'NoNotification'
}

export type DiscussionMessagesOrderByInput = {
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
};

export type DiscussionSubscriptionOrderByInput = {
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
};

export type CreateDiscussionInput = {
  /** The topic of the discussion to be created */
  topic: Scalars['String'];
  /** Short description about the topic */
  description: Scalars['String'];
  /** The ID of the common, for which we are creating the discussion */
  commonId: Scalars['ID'];
  /** The ID of the proposal, if this is proposal discussion */
  proposalId?: Maybe<Scalars['ID']>;
};

export type CreateDiscussionMessageInput = {
  /** The ID of the discussion, for which we are creating the message */
  discussionId: Scalars['ID'];
  /** The message itself */
  message: Scalars['String'];
};

export type CommonMember = BaseEntity & {
  __typename?: 'CommonMember';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  userId: Scalars['ID'];
  commonId: Scalars['ID'];
  roles: Array<CommonMemberRole>;
  user?: Maybe<User>;
  common?: Maybe<Common>;
  proposals: Array<Proposal>;
};


export type CommonMemberProposalsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<ProposalWhereInput>;
};

export type CommonMemberOrderByInput = {
  createdAt: SortOrder;
};

export enum CommonMemberRole {
  Founder = 'Founder',
  Moderator = 'Moderator'
}

export enum NotificationType {
  JoinRequestAccepted = 'JoinRequestAccepted',
  JoinRequestRejected = 'JoinRequestRejected',
  FundingRequestAccepted = 'FundingRequestAccepted',
  FundingRequestRejected = 'FundingRequestRejected'
}

export enum NotificationSeenStatus {
  NotSeen = 'NotSeen',
  Seen = 'Seen',
  Done = 'Done'
}

export type Notification = BaseEntity & {
  __typename?: 'Notification';
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
  /** Whether the notification should be shown in the user notification feed */
  show: Scalars['Boolean'];
  type: NotificationType;
  seenStatus: NotificationSeenStatus;
  /** The ID of the linked user */
  userId: Scalars['UUID'];
  /** The linked user. Expensive operation */
  user: User;
  /** The ID of the linked common. May be null */
  commonId?: Maybe<Scalars['UUID']>;
  /** The linked common. Expensive operation that may return null */
  common?: Maybe<Common>;
  /** The ID of the linked proposal. May be null */
  proposalId?: Maybe<Scalars['UUID']>;
  /** The linked proposal. Expensive operation that may return null */
  proposal?: Maybe<Proposal>;
  /** The ID of the linked discussion. May be null */
  discussionId?: Maybe<Scalars['UUID']>;
  /** The linked discussion. Expensive operation that may return null */
  discussion?: Maybe<Discussion>;
};

export type NotificationWhereInput = {
  seenStatus?: Maybe<NotificationSeenStatus>;
  type?: Maybe<NotificationType>;
  userId?: Maybe<Scalars['ID']>;
  commonId?: Maybe<Scalars['UUID']>;
  proposalId?: Maybe<Scalars['UUID']>;
  discussionId?: Maybe<Scalars['UUID']>;
};

export type NotificationWhereUniqueInput = {
  id?: Maybe<Scalars['UUID']>;
};

export type NotificationOrderByInput = {
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  status?: Maybe<SortOrder>;
};


export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type Link = {
  __typename?: 'Link';
  /** The display title of the link */
  title: Scalars['String'];
  /** The actual link part of the link */
  url: Scalars['String'];
};

export type BaseEntity = {
  /** The main identifier of the item */
  id: Scalars['UUID'];
  /** The date, at which the item was created */
  createdAt: Scalars['DateTime'];
  /** The date, at which the item was last modified */
  updatedAt: Scalars['DateTime'];
};

export type PaginateInput = {
  take: Scalars['Int'];
  skip?: Maybe<Scalars['Int']>;
};

export type LinkInput = {
  /** The display title of the link */
  title: Scalars['String'];
  /** The actual link part of the link */
  url: Scalars['String'];
};

export type StringFilter = {
  contains?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  equals?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  notIn?: Maybe<Array<Scalars['String']>>;
};

export type BillingDetailsInput = {
  name: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  line1: Scalars['String'];
  postalCode: Scalars['String'];
  line2?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
};

export type CreateRoleInput = {
  name: Scalars['String'];
  displayName: Scalars['String'];
  description: Scalars['String'];
  permissions: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Provide ID to fetch specific user or do not pass anything to get the currently authenticated user */
  user?: Maybe<User>;
  generateUserAuthToken: Scalars['String'];
  roles?: Maybe<Array<Maybe<Role>>>;
  events?: Maybe<Array<Maybe<Event>>>;
  common?: Maybe<Common>;
  commons?: Maybe<Array<Maybe<Common>>>;
  proposal?: Maybe<Proposal>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  getStatistics?: Maybe<Array<Maybe<Statistic>>>;
  discussion?: Maybe<Discussion>;
};


export type QueryUserArgs = {
  userId?: Maybe<Scalars['ID']>;
};


export type QueryGenerateUserAuthTokenArgs = {
  authId: Scalars['String'];
};


export type QueryRolesArgs = {
  paginate?: Maybe<PaginateInput>;
};


export type QueryEventsArgs = {
  paginate?: Maybe<PaginateInput>;
};


export type QueryCommonArgs = {
  where: CommonWhereUniqueInput;
};


export type QueryCommonsArgs = {
  paginate?: Maybe<PaginateInput>;
};


export type QueryProposalArgs = {
  where: ProposalWhereUniqueInput;
};


export type QueryProposalsArgs = {
  where?: Maybe<ProposalWhereInput>;
  paginate?: Maybe<PaginateInput>;
};


export type QueryGetStatisticsArgs = {
  where?: Maybe<StatisticsWhereInput>;
};


export type QueryDiscussionArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates new user in the system */
  createUser: User;
  createUserNotificationToken: UserNotificationToken;
  voidUserNotificationToken: UserNotificationToken;
  createRole?: Maybe<Role>;
  assignRole?: Maybe<Scalars['Void']>;
  unassignRole?: Maybe<Scalars['Void']>;
  createCard: Card;
  createVote: Vote;
  createCommon: Common;
  delistCommon?: Maybe<Scalars['Boolean']>;
  whitelistCommon?: Maybe<Scalars['Boolean']>;
  actOnReport?: Maybe<Report>;
  reportDiscussionMessage: Report;
  finalizeProposal: Scalars['Boolean'];
  /** Create new proposal of type JOIN. */
  createJoinProposal: Proposal;
  createFundingProposal: Proposal;
  createDiscussion: Discussion;
  createDiscussionMessage: DiscussionMessage;
  changeDiscussionSubscriptionType?: Maybe<DiscussionSubscription>;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateUserNotificationTokenArgs = {
  input: CreateUserNotificationTokenInput;
};


export type MutationVoidUserNotificationTokenArgs = {
  tokenId: Scalars['ID'];
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationAssignRoleArgs = {
  userId: Scalars['ID'];
  roleId: Scalars['ID'];
};


export type MutationUnassignRoleArgs = {
  userId: Scalars['ID'];
  roleId: Scalars['ID'];
};


export type MutationCreateCardArgs = {
  input: CreateCardInput;
};


export type MutationCreateVoteArgs = {
  input: CreateVoteInput;
};


export type MutationCreateCommonArgs = {
  input: CreateCommonInput;
};


export type MutationDelistCommonArgs = {
  commonId: Scalars['String'];
};


export type MutationWhitelistCommonArgs = {
  commonId: Scalars['String'];
};


export type MutationActOnReportArgs = {
  input: ActOnReportInput;
};


export type MutationReportDiscussionMessageArgs = {
  input: ReportDiscussionMessageInput;
};


export type MutationFinalizeProposalArgs = {
  proposalId: Scalars['ID'];
};


export type MutationCreateJoinProposalArgs = {
  input: CreateJoinProposalInput;
};


export type MutationCreateFundingProposalArgs = {
  input: CreateFundingProposalInput;
};


export type MutationCreateDiscussionArgs = {
  input: CreateDiscussionInput;
};


export type MutationCreateDiscussionMessageArgs = {
  input: CreateDiscussionMessageInput;
};


export type MutationChangeDiscussionSubscriptionTypeArgs = {
  id: Scalars['ID'];
  type: DiscussionSubscriptionType;
};

export type Subscription = {
  __typename?: 'Subscription';
  onProposalChange?: Maybe<Proposal>;
  discussionMessageCreated?: Maybe<DiscussionMessage>;
  notificationCreated?: Maybe<Notification>;
};


export type SubscriptionOnProposalChangeArgs = {
  proposalId: Scalars['ID'];
};


export type SubscriptionDiscussionMessageCreatedArgs = {
  discussionId: Scalars['ID'];
};

export type LoadUserContextQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadUserContextQuery = (
  { __typename?: 'Query' }
  & {
  user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'displayName' | 'email' | 'photo' | 'permissions'>
    )>
}
  );

export type GetCommonDetailsQueryVariables = Exact<{
  commonId: Scalars['ID'];
  paginate: PaginateInput;
}>;


export type GetCommonDetailsQuery = (
  { __typename?: 'Query' }
  & {
  common?: Maybe<(
    { __typename?: 'Common' }
    & Pick<Common, 'name' | 'createdAt' | 'updatedAt' | 'balance' | 'raised' | 'fundingType' | 'activeJoinProposals' | 'activeFundingProposals' | 'byline' | 'action' | 'description' | 'image' | 'whitelisted'>
    & {
    members: Array<Maybe<(
      { __typename?: 'CommonMember' }
      & Pick<CommonMember, 'createdAt' | 'userId' | 'roles'>
      & {
      user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'firstName' | 'lastName'>
        )>
    }
      )>>, proposals: Array<(
      { __typename?: 'Proposal' }
      & Pick<Proposal, 'id' | 'type' | 'title' | 'description'>
      & {
      funding?: Maybe<(
        { __typename?: 'FundingProposal' }
        & Pick<FundingProposal, 'amount'>
        )>, join?: Maybe<(
        { __typename?: 'JoinProposal' }
        & Pick<JoinProposal, 'fundingType' | 'funding'>
        )>
    }
      )>
  }
    )>
}
  );

export type GetProposalDetailsQueryVariables = Exact<{
  where: ProposalWhereUniqueInput;
}>;


export type GetProposalDetailsQuery = (
  { __typename?: 'Query' }
  & {
  proposal?: Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'type' | 'createdAt' | 'updatedAt' | 'votesFor' | 'votesAgainst' | 'state' | 'description'>
    & {
    join?: Maybe<(
      { __typename?: 'JoinProposal' }
      & Pick<JoinProposal, 'funding' | 'fundingType' | 'paymentState'>
      )>, funding?: Maybe<(
      { __typename?: 'FundingProposal' }
      & Pick<FundingProposal, 'amount' | 'fundingState'>
      )>, user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
      ), common: (
      { __typename?: 'Common' }
      & {
      members: Array<Maybe<(
        { __typename?: 'CommonMember' }
        & Pick<CommonMember, 'userId'>
        )>>
    }
      ), votes: Array<(
      { __typename?: 'Vote' }
      & Pick<Vote, 'id' | 'outcome'>
      & {
      voter: (
        { __typename?: 'CommonMember' }
        & {
        user?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'id' | 'firstName' | 'lastName'>
          )>
      }
        )
    }
      )>
  }
    )>
}
  );

export type WhitelistCommonMutationVariables = Exact<{
  commonId: Scalars['String'];
}>;


export type WhitelistCommonMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'whitelistCommon'>
  );

export type DelistCommonMutationVariables = Exact<{
  commonId: Scalars['String'];
}>;


export type DelistCommonMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'delistCommon'>
  );

export type GetLatestEventsQueryVariables = Exact<{
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
}>;


export type GetLatestEventsQuery = (
  { __typename?: 'Query' }
  & {
  events?: Maybe<Array<Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id' | 'createdAt' | 'type'>
    & {
    user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'firstName' | 'lastName' | 'photo'>
      )>
  }
    )>>>
}
  );

export type GetCommonsHomescreenDataQueryVariables = Exact<{
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
}>;


export type GetCommonsHomescreenDataQuery = (
  { __typename?: 'Query' }
  & {
  commons?: Maybe<Array<Maybe<(
    { __typename?: 'Common' }
    & Pick<Common, 'id' | 'name' | 'raised' | 'balance' | 'createdAt' | 'updatedAt' | 'description' | 'byline' | 'fundingType' | 'fundingMinimumAmount'>
    & {
    members: Array<Maybe<(
      { __typename?: 'CommonMember' }
      & Pick<CommonMember, 'userId'>
      )>>
  }
    )>>>
}
  );

export type GetAllTimeStatistiscQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTimeStatistiscQuery = (
  { __typename?: 'Query' }
  & {
  getStatistics?: Maybe<Array<Maybe<(
    { __typename?: 'Statistic' }
    & Pick<Statistic, 'users' | 'commons' | 'joinProposals' | 'fundingProposals'>
    )>>>
}
  );

export type GetProposalsHomescreenQueryVariables = Exact<{
  fundingPaginate: PaginateInput;
  joinPaginate: PaginateInput;
}>;


export type GetProposalsHomescreenQuery = (
  { __typename?: 'Query' }
  & {
  funding?: Maybe<Array<Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'commonId' | 'votesFor' | 'votesAgainst' | 'title' | 'description'>
    & {
    funding?: Maybe<(
      { __typename?: 'FundingProposal' }
      & Pick<FundingProposal, 'amount'>
      )>
  }
    )>>>, join?: Maybe<Array<Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'commonId' | 'title' | 'description'>
    & {
    join?: Maybe<(
      { __typename?: 'JoinProposal' }
      & Pick<JoinProposal, 'funding' | 'fundingType'>
      )>
  }
    )>>>
}
  );


export const LoadUserContextDocument = gql`
  query loadUserContext {
    user {
      id
      firstName
      lastName
      displayName
      email
      photo
      permissions
    }
  }
`;

/**
 * __useLoadUserContextQuery__
 *
 * To run a query within a React component, call `useLoadUserContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadUserContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadUserContextQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoadUserContextQuery(baseOptions?: Apollo.QueryHookOptions<LoadUserContextQuery, LoadUserContextQueryVariables>) {
  return Apollo.useQuery<LoadUserContextQuery, LoadUserContextQueryVariables>(LoadUserContextDocument, baseOptions);
}
export function useLoadUserContextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoadUserContextQuery, LoadUserContextQueryVariables>) {
  return Apollo.useLazyQuery<LoadUserContextQuery, LoadUserContextQueryVariables>(LoadUserContextDocument, baseOptions);
}
export type LoadUserContextQueryHookResult = ReturnType<typeof useLoadUserContextQuery>;
export type LoadUserContextLazyQueryHookResult = ReturnType<typeof useLoadUserContextLazyQuery>;
export type LoadUserContextQueryResult = Apollo.QueryResult<LoadUserContextQuery, LoadUserContextQueryVariables>;
export const GetCommonDetailsDocument = gql`
  query getCommonDetails($commonId: ID!, $paginate: PaginateInput!) {
    common(where: {id: $commonId}) {
      name
      createdAt
      updatedAt
      balance
      raised
      fundingType
      activeJoinProposals
      activeFundingProposals
      byline
      action
      description
      image
      whitelisted
      members {
        createdAt
        userId
        roles
        user {
          firstName
          lastName
        }
      }
      proposals(paginate: $paginate) {
        id
        type
        title
        description
        funding {
          amount
        }
        join {
          fundingType
          funding
        }
      }
    }
  }
`;

/**
 * __useGetCommonDetailsQuery__
 *
 * To run a query within a React component, call `useGetCommonDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommonDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommonDetailsQuery({
 *   variables: {
 *      commonId: // value for 'commonId'
 *      paginate: // value for 'paginate'
 *   },
 * });
 */
export function useGetCommonDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetCommonDetailsQuery, GetCommonDetailsQueryVariables>) {
  return Apollo.useQuery<GetCommonDetailsQuery, GetCommonDetailsQueryVariables>(GetCommonDetailsDocument, baseOptions);
}
export function useGetCommonDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCommonDetailsQuery, GetCommonDetailsQueryVariables>) {
  return Apollo.useLazyQuery<GetCommonDetailsQuery, GetCommonDetailsQueryVariables>(GetCommonDetailsDocument, baseOptions);
}
export type GetCommonDetailsQueryHookResult = ReturnType<typeof useGetCommonDetailsQuery>;
export type GetCommonDetailsLazyQueryHookResult = ReturnType<typeof useGetCommonDetailsLazyQuery>;
export type GetCommonDetailsQueryResult = Apollo.QueryResult<GetCommonDetailsQuery, GetCommonDetailsQueryVariables>;
export const GetProposalDetailsDocument = gql`
  query getProposalDetails($where: ProposalWhereUniqueInput!) {
    proposal(where: $where) {
      id
      join {
        funding
        fundingType
        paymentState
      }
      funding {
        amount
        fundingState
      }
      type
      createdAt
      updatedAt
      votesFor
      votesAgainst
      state
      user {
        id
        firstName
        lastName
      }
      common {
        members {
          userId
        }
      }
      description
      votes {
        id
        outcome
        voter {
          user {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;

/**
 * __useGetProposalDetailsQuery__
 *
 * To run a query within a React component, call `useGetProposalDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalDetailsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetProposalDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetProposalDetailsQuery, GetProposalDetailsQueryVariables>) {
  return Apollo.useQuery<GetProposalDetailsQuery, GetProposalDetailsQueryVariables>(GetProposalDetailsDocument, baseOptions);
}
export function useGetProposalDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProposalDetailsQuery, GetProposalDetailsQueryVariables>) {
  return Apollo.useLazyQuery<GetProposalDetailsQuery, GetProposalDetailsQueryVariables>(GetProposalDetailsDocument, baseOptions);
}
export type GetProposalDetailsQueryHookResult = ReturnType<typeof useGetProposalDetailsQuery>;
export type GetProposalDetailsLazyQueryHookResult = ReturnType<typeof useGetProposalDetailsLazyQuery>;
export type GetProposalDetailsQueryResult = Apollo.QueryResult<GetProposalDetailsQuery, GetProposalDetailsQueryVariables>;
export const WhitelistCommonDocument = gql`
  mutation whitelistCommon($commonId: String!) {
    whitelistCommon(commonId: $commonId)
  }
`;
export type WhitelistCommonMutationFn = Apollo.MutationFunction<WhitelistCommonMutation, WhitelistCommonMutationVariables>;

/**
 * __useWhitelistCommonMutation__
 *
 * To run a mutation, you first call `useWhitelistCommonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWhitelistCommonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [whitelistCommonMutation, { data, loading, error }] = useWhitelistCommonMutation({
 *   variables: {
 *      commonId: // value for 'commonId'
 *   },
 * });
 */
export function useWhitelistCommonMutation(baseOptions?: Apollo.MutationHookOptions<WhitelistCommonMutation, WhitelistCommonMutationVariables>) {
  return Apollo.useMutation<WhitelistCommonMutation, WhitelistCommonMutationVariables>(WhitelistCommonDocument, baseOptions);
}
export type WhitelistCommonMutationHookResult = ReturnType<typeof useWhitelistCommonMutation>;
export type WhitelistCommonMutationResult = Apollo.MutationResult<WhitelistCommonMutation>;
export type WhitelistCommonMutationOptions = Apollo.BaseMutationOptions<WhitelistCommonMutation, WhitelistCommonMutationVariables>;
export const DelistCommonDocument = gql`
  mutation delistCommon($commonId: String!) {
    delistCommon(commonId: $commonId)
  }
`;
export type DelistCommonMutationFn = Apollo.MutationFunction<DelistCommonMutation, DelistCommonMutationVariables>;

/**
 * __useDelistCommonMutation__
 *
 * To run a mutation, you first call `useDelistCommonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelistCommonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delistCommonMutation, { data, loading, error }] = useDelistCommonMutation({
 *   variables: {
 *      commonId: // value for 'commonId'
 *   },
 * });
 */
export function useDelistCommonMutation(baseOptions?: Apollo.MutationHookOptions<DelistCommonMutation, DelistCommonMutationVariables>) {
  return Apollo.useMutation<DelistCommonMutation, DelistCommonMutationVariables>(DelistCommonDocument, baseOptions);
}
export type DelistCommonMutationHookResult = ReturnType<typeof useDelistCommonMutation>;
export type DelistCommonMutationResult = Apollo.MutationResult<DelistCommonMutation>;
export type DelistCommonMutationOptions = Apollo.BaseMutationOptions<DelistCommonMutation, DelistCommonMutationVariables>;
export const GetLatestEventsDocument = gql`
  query GetLatestEvents($take: Int = 10, $skip: Int = 0) {
    events(paginate: {take: $take, skip: $skip}) {
      id
      createdAt
      type
      user {
        firstName
        lastName
        photo
      }
    }
  }
`;

/**
 * __useGetLatestEventsQuery__
 *
 * To run a query within a React component, call `useGetLatestEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestEventsQuery({
 *   variables: {
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetLatestEventsQuery(baseOptions?: Apollo.QueryHookOptions<GetLatestEventsQuery, GetLatestEventsQueryVariables>) {
  return Apollo.useQuery<GetLatestEventsQuery, GetLatestEventsQueryVariables>(GetLatestEventsDocument, baseOptions);
}
export function useGetLatestEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestEventsQuery, GetLatestEventsQueryVariables>) {
  return Apollo.useLazyQuery<GetLatestEventsQuery, GetLatestEventsQueryVariables>(GetLatestEventsDocument, baseOptions);
}
export type GetLatestEventsQueryHookResult = ReturnType<typeof useGetLatestEventsQuery>;
export type GetLatestEventsLazyQueryHookResult = ReturnType<typeof useGetLatestEventsLazyQuery>;
export type GetLatestEventsQueryResult = Apollo.QueryResult<GetLatestEventsQuery, GetLatestEventsQueryVariables>;
export const GetCommonsHomescreenDataDocument = gql`
  query getCommonsHomescreenData($take: Int = 10, $skip: Int) {
    commons(paginate: {take: $take, skip: $skip}) {
      id
      name
      raised
      balance
      createdAt
      updatedAt
      members {
        userId
      }
      description
      byline
      fundingType
      fundingMinimumAmount
    }
  }
`;

/**
 * __useGetCommonsHomescreenDataQuery__
 *
 * To run a query within a React component, call `useGetCommonsHomescreenDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommonsHomescreenDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommonsHomescreenDataQuery({
 *   variables: {
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetCommonsHomescreenDataQuery(baseOptions?: Apollo.QueryHookOptions<GetCommonsHomescreenDataQuery, GetCommonsHomescreenDataQueryVariables>) {
  return Apollo.useQuery<GetCommonsHomescreenDataQuery, GetCommonsHomescreenDataQueryVariables>(GetCommonsHomescreenDataDocument, baseOptions);
}
export function useGetCommonsHomescreenDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCommonsHomescreenDataQuery, GetCommonsHomescreenDataQueryVariables>) {
  return Apollo.useLazyQuery<GetCommonsHomescreenDataQuery, GetCommonsHomescreenDataQueryVariables>(GetCommonsHomescreenDataDocument, baseOptions);
}
export type GetCommonsHomescreenDataQueryHookResult = ReturnType<typeof useGetCommonsHomescreenDataQuery>;
export type GetCommonsHomescreenDataLazyQueryHookResult = ReturnType<typeof useGetCommonsHomescreenDataLazyQuery>;
export type GetCommonsHomescreenDataQueryResult = Apollo.QueryResult<GetCommonsHomescreenDataQuery, GetCommonsHomescreenDataQueryVariables>;
export const GetAllTimeStatistiscDocument = gql`
  query getAllTimeStatistisc {
    getStatistics(where: {type: AllTime}) {
      users
      commons
      joinProposals
      fundingProposals
    }
  }
`;

/**
 * __useGetAllTimeStatistiscQuery__
 *
 * To run a query within a React component, call `useGetAllTimeStatistiscQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTimeStatistiscQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTimeStatistiscQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTimeStatistiscQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>) {
  return Apollo.useQuery<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>(GetAllTimeStatistiscDocument, baseOptions);
}
export function useGetAllTimeStatistiscLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>) {
  return Apollo.useLazyQuery<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>(GetAllTimeStatistiscDocument, baseOptions);
}
export type GetAllTimeStatistiscQueryHookResult = ReturnType<typeof useGetAllTimeStatistiscQuery>;
export type GetAllTimeStatistiscLazyQueryHookResult = ReturnType<typeof useGetAllTimeStatistiscLazyQuery>;
export type GetAllTimeStatistiscQueryResult = Apollo.QueryResult<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>;
export const GetProposalsHomescreenDocument = gql`
  query getProposalsHomescreen($fundingPaginate: PaginateInput!, $joinPaginate: PaginateInput!) {
    funding: proposals(where: {type: FundingRequest}, paginate: $fundingPaginate) {
      id
      commonId
      votesFor
      votesAgainst
      title
      description
      funding {
        amount
      }
    }
    join: proposals(where: {type: JoinRequest}, paginate: $joinPaginate) {
      id
      commonId
      title
      description
      join {
        funding
        fundingType
      }
    }
  }
`;

/**
 * __useGetProposalsHomescreenQuery__
 *
 * To run a query within a React component, call `useGetProposalsHomescreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalsHomescreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalsHomescreenQuery({
 *   variables: {
 *      fundingPaginate: // value for 'fundingPaginate'
 *      joinPaginate: // value for 'joinPaginate'
 *   },
 * });
 */
export function useGetProposalsHomescreenQuery(baseOptions: Apollo.QueryHookOptions<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>) {
  return Apollo.useQuery<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>(GetProposalsHomescreenDocument, baseOptions);
}
export function useGetProposalsHomescreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>) {
  return Apollo.useLazyQuery<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>(GetProposalsHomescreenDocument, baseOptions);
}
export type GetProposalsHomescreenQueryHookResult = ReturnType<typeof useGetProposalsHomescreenQuery>;
export type GetProposalsHomescreenLazyQueryHookResult = ReturnType<typeof useGetProposalsHomescreenLazyQuery>;
export type GetProposalsHomescreenQueryResult = Apollo.QueryResult<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>;