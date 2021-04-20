/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { IRequestContext } from "./../context"
import { QueryComplexity } from "nexus/dist/plugins/queryComplexityPlugin"
import { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.
     */
    url<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "URL";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSON";
    /**
     * A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier.
     */
    uuid<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "UUID";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.
     */
    url<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "URL";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
    /**
     * A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier.
     */
    uuid<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "UUID";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  BillingDetailsInput: { // input type
    city: string; // String!
    country: string; // String!
    district?: string | null; // String
    line1: string; // String!
    line2?: string | null; // String
    name: string; // String!
    postalCode: string; // String!
  }
  CommonMemberOrderByInput: { // input type
    createdAt: NexusGenEnums['SortOrder']; // SortOrder!
  }
  CommonWhereUniqueInput: { // input type
    id: string; // ID!
  }
  CreateCardInput: { // input type
    billingDetails: NexusGenInputs['BillingDetailsInput']; // BillingDetailsInput!
    encryptedData: string; // String!
    expMonth: number; // Int!
    expYear: number; // Int!
    keyId: string; // String!
  }
  CreateCommonInput: { // input type
    fundingMinimumAmount: number; // Int!
    fundingType: NexusGenEnums['FundingType']; // FundingType!
    name: string; // String!
  }
  CreateDiscussionInput: { // input type
    commonId: string; // ID!
    description: string; // String!
    proposalId?: string | null; // ID
    topic: string; // String!
  }
  CreateDiscussionMessageInput: { // input type
    discussionId: string; // ID!
    message: string; // String!
  }
  CreateFundingProposalInput: { // input type
    amount: number; // Int!
    commonId: string; // ID!
    description: string; // String!
    files?: NexusGenInputs['ProposalFileInput'][] | null; // [ProposalFileInput!]
    images?: NexusGenInputs['ProposalImageInput'][] | null; // [ProposalImageInput!]
    links?: NexusGenInputs['ProposalLinkInput'][] | null; // [ProposalLinkInput!]
    title: string; // String!
  }
  CreateJoinProposalInput: { // input type
    cardId: string; // String!
    commonId: string; // String!
    description: string; // String!
    fundingAmount: number; // Int!
    links?: NexusGenInputs['LinkInput'][] | null; // [LinkInput!]
    title: string; // String!
  }
  CreateUserInput: { // input type
    email: string; // String!
    firstName: string; // String!
    lastName: string; // String!
  }
  CreateUserNotificationTokenInput: { // input type
    description: string; // String!
    token: string; // String!
  }
  CreateVoteInput: { // input type
    outcome: NexusGenEnums['VoteOutcome']; // VoteOutcome!
    proposalId: string; // ID!
  }
  DiscussionMessagesOrderByInput: { // input type
    createdAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
    updatedAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  DiscussionSubscriptionOrderByInput: { // input type
    createdAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
    updatedAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  EventOrderByInput: { // input type
    createdAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
    type?: NexusGenEnums['SortOrder'] | null; // SortOrder
    updatedAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  LinkInput: { // input type
    title: string; // String!
    url: string; // String!
  }
  NotificationOrderByInput: { // input type
    createdAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
    status?: NexusGenEnums['SortOrder'] | null; // SortOrder
    updatedAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  NotificationWhereInput: { // input type
    commonId?: NexusGenScalars['UUID'] | null; // UUID
    discussionId?: NexusGenScalars['UUID'] | null; // UUID
    proposalId?: NexusGenScalars['UUID'] | null; // UUID
    seenStatus?: NexusGenEnums['NotificationSeenStatus'] | null; // NotificationSeenStatus
    type?: NexusGenEnums['NotificationType'] | null; // NotificationType
    userId?: string | null; // ID
  }
  NotificationWhereUniqueInput: { // input type
    id?: NexusGenScalars['UUID'] | null; // UUID
  }
  ProposalFileInput: { // input type
    value: string; // String!
  }
  ProposalImageInput: { // input type
    value: string; // String!
  }
  ProposalLinkInput: { // input type
    title: string; // String!
    url: string; // String!
  }
  ProposalWhereInput: { // input type
    type?: NexusGenEnums['ProposalType'] | null; // ProposalType
  }
  ProposalWhereUniqueInput: { // input type
    id: NexusGenScalars['UUID']; // UUID!
  }
  ReportDiscussionMessageInput: { // input type
    for: NexusGenEnums['ReportFor']; // ReportFor!
    messageId: NexusGenScalars['UUID']; // UUID!
    note: string; // String!
  }
  ReportWhereInput: { // input type
    for?: NexusGenEnums['ReportFor'] | null; // ReportFor
    status?: NexusGenEnums['ReportStatus'] | null; // ReportStatus
  }
  StringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
}

export interface NexusGenEnums {
  CommonMemberRole: "Founder" | "Moderator"
  DiscussionMessageType: "Message"
  DiscussionSubscriptionType: "AllNotifications" | "NoNotification" | "OnlyMentions"
  DiscussionType: "CommonDiscussion" | "ProposalDiscussion"
  EventType: "CardCreated" | "CardCvvVerificationFailed" | "CardCvvVerificationPassed" | "CommonCreated" | "CommonMemberCreated" | "CommonMemberRoleAdded" | "CommonMemberRoleRemoved" | "DiscussionCreated" | "DiscussionMessageCreated" | "DiscussionSubscriptionCreated" | "DiscussionSubscriptionTypeChanged" | "FundingRequestAccepted" | "FundingRequestCreated" | "FundingRequestRejected" | "JoinRequestAccepted" | "JoinRequestCreated" | "JoinRequestRejected" | "NotificationTemplateCreated" | "NotificationTemplateUpdated" | "PaymentCreated" | "PaymentFailed" | "PaymentSucceeded" | "ProposalExpired" | "ProposalMajorityReached" | "ReportActionTaken" | "ReportCreated" | "ReportDismissed" | "UserCreated" | "UserNotificationTokenCreated" | "UserNotificationTokenExpired" | "UserNotificationTokenRefreshed" | "UserNotificationTokenVoided" | "VoteCreated"
  FundingType: "Monthly" | "OneTime"
  NotificationSeenStatus: "Done" | "NotSeen" | "Seen"
  NotificationType: "FundingRequestAccepted" | "FundingRequestRejected" | "JoinRequestAccepted" | "JoinRequestRejected"
  ProposalState: "Accepted" | "Countdown" | "Finalizing" | "Rejected"
  ProposalType: "FundingRequest" | "JoinRequest"
  ReportAuditor: "CommonModerator" | "SystemAdmin"
  ReportFor: "FalseNews" | "Harassment" | "Hate" | "Nudity" | "Other" | "Spam" | "Violance"
  ReportStatus: "AdminActionTaken" | "AwaitingReview" | "Clossed" | "Dissmissed" | "ModeratorActionTaken"
  SortOrder: "asc" | "desc"
  UserNotificationTokenState: "Active" | "Expired" | "Voided"
  VoteOutcome: "Approve" | "Condemn"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
  JSON: any
  URL: any
  UUID: any
}

export interface NexusGenObjects {
  Card: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Common: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    whitelisted: boolean; // Boolean!
  }
  CommonMember: { // root type
    commonId: string; // ID!
    id: string; // ID!
    roles: NexusGenEnums['CommonMemberRole'][]; // [CommonMemberRole!]!
    userId: string; // ID!
  }
  Discussion: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    id: NexusGenScalars['UUID']; // UUID!
    latestMessage: NexusGenScalars['DateTime']; // DateTime!
    topic: string; // String!
    type: NexusGenEnums['DiscussionType']; // DiscussionType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  DiscussionMessage: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: NexusGenScalars['UUID']; // UUID!
    message: string; // String!
    type: NexusGenEnums['DiscussionMessageType']; // DiscussionMessageType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  DiscussionSubscription: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    discussionId: NexusGenScalars['UUID']; // UUID!
    id: NexusGenScalars['UUID']; // UUID!
    type: NexusGenEnums['DiscussionSubscriptionType']; // DiscussionSubscriptionType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string; // String!
  }
  Event: { // root type
    commonId?: string | null; // ID
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    payload?: NexusGenScalars['JSON'] | null; // JSON
    type: NexusGenEnums['EventType']; // EventType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId?: string | null; // ID
  }
  FundingProposal: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  JoinProposal: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Link: { // root type
    title: string; // String!
    url: string; // String!
  }
  Mutation: {};
  Notification: { // root type
    commonId?: NexusGenScalars['UUID'] | null; // UUID
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    discussionId?: NexusGenScalars['UUID'] | null; // UUID
    id: NexusGenScalars['UUID']; // UUID!
    proposalId?: NexusGenScalars['UUID'] | null; // UUID
    seenStatus: NexusGenEnums['NotificationSeenStatus']; // NotificationSeenStatus!
    show: boolean; // Boolean!
    type: NexusGenEnums['NotificationType']; // NotificationType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: NexusGenScalars['UUID']; // UUID!
  }
  Proposal: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    state: NexusGenEnums['ProposalState']; // ProposalState!
    type: NexusGenEnums['ProposalType']; // ProposalType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Query: {};
  Report: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    for: NexusGenEnums['ReportFor']; // ReportFor!
    id: NexusGenScalars['UUID']; // UUID!
    messageId: NexusGenScalars['UUID']; // UUID!
    note: string; // String!
    reporterId: string; // ID!
    reviewedOn?: NexusGenScalars['DateTime'] | null; // DateTime
    status: NexusGenEnums['ReportStatus']; // ReportStatus!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Subscription: {};
  User: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  UserNotificationToken: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    id: NexusGenScalars['UUID']; // UUID!
    lastUsed: NexusGenScalars['DateTime']; // DateTime!
    lastVerified: NexusGenScalars['DateTime']; // DateTime!
    state: NexusGenEnums['UserNotificationTokenState']; // UserNotificationTokenState!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Vote: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
}

export interface NexusGenInterfaces {
  BaseEntity: NexusGenRootTypes['Discussion'] | NexusGenRootTypes['DiscussionMessage'] | NexusGenRootTypes['DiscussionSubscription'] | NexusGenRootTypes['Notification'] | NexusGenRootTypes['Report'] | NexusGenRootTypes['UserNotificationToken'];
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Card: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Common: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    discussions: NexusGenRootTypes['Discussion'][]; // [Discussion!]!
    events: NexusGenRootTypes['Event'][]; // [Event!]!
    id: string; // ID!
    members: Array<NexusGenRootTypes['CommonMember'] | null>; // [CommonMember]!
    name: string; // String!
    proposals: NexusGenRootTypes['Proposal'][]; // [Proposal!]!
    reports: NexusGenRootTypes['Report'][]; // [Report!]!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    whitelisted: boolean; // Boolean!
  }
  CommonMember: { // field return type
    common: NexusGenRootTypes['Common'] | null; // Common
    commonId: string; // ID!
    id: string; // ID!
    proposals: NexusGenRootTypes['Proposal'][]; // [Proposal!]!
    roles: NexusGenEnums['CommonMemberRole'][]; // [CommonMemberRole!]!
    user: NexusGenRootTypes['User'] | null; // User
    userId: string; // ID!
  }
  Discussion: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    id: NexusGenScalars['UUID']; // UUID!
    latestMessage: NexusGenScalars['DateTime']; // DateTime!
    messages: NexusGenRootTypes['DiscussionMessage'][]; // [DiscussionMessage!]!
    topic: string; // String!
    type: NexusGenEnums['DiscussionType']; // DiscussionType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  DiscussionMessage: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: NexusGenScalars['UUID']; // UUID!
    message: string; // String!
    type: NexusGenEnums['DiscussionMessageType']; // DiscussionMessageType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  DiscussionSubscription: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    discussion: NexusGenRootTypes['Discussion']; // Discussion!
    discussionId: NexusGenScalars['UUID']; // UUID!
    id: NexusGenScalars['UUID']; // UUID!
    type: NexusGenEnums['DiscussionSubscriptionType']; // DiscussionSubscriptionType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string; // String!
  }
  Event: { // field return type
    commonId: string | null; // ID
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    payload: NexusGenScalars['JSON'] | null; // JSON
    type: NexusGenEnums['EventType']; // EventType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string | null; // ID
  }
  FundingProposal: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  JoinProposal: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Link: { // field return type
    title: string; // String!
    url: string; // String!
  }
  Mutation: { // field return type
    changeDiscussionSubscriptionType: NexusGenRootTypes['DiscussionSubscription'] | null; // DiscussionSubscription
    createCard: NexusGenRootTypes['Card']; // Card!
    createCommon: NexusGenRootTypes['Common']; // Common!
    createDiscussion: NexusGenRootTypes['Discussion']; // Discussion!
    createDiscussionMessage: NexusGenRootTypes['DiscussionMessage']; // DiscussionMessage!
    createFundingProposal: NexusGenRootTypes['Proposal']; // Proposal!
    createJoinProposal: NexusGenRootTypes['Proposal']; // Proposal!
    createUser: NexusGenRootTypes['User']; // User!
    createUserNotificationToken: NexusGenRootTypes['UserNotificationToken']; // UserNotificationToken!
    createVote: NexusGenRootTypes['Vote']; // Vote!
    finalizeProposal: boolean; // Boolean!
    reportDiscussionMessage: NexusGenRootTypes['Report']; // Report!
    voidUserNotificationToken: NexusGenRootTypes['UserNotificationToken']; // UserNotificationToken!
  }
  Notification: { // field return type
    common: NexusGenRootTypes['Common'] | null; // Common
    commonId: NexusGenScalars['UUID'] | null; // UUID
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    discussion: NexusGenRootTypes['Discussion'] | null; // Discussion
    discussionId: NexusGenScalars['UUID'] | null; // UUID
    id: NexusGenScalars['UUID']; // UUID!
    proposal: NexusGenRootTypes['Proposal'] | null; // Proposal
    proposalId: NexusGenScalars['UUID'] | null; // UUID
    seenStatus: NexusGenEnums['NotificationSeenStatus']; // NotificationSeenStatus!
    show: boolean; // Boolean!
    type: NexusGenEnums['NotificationType']; // NotificationType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    userId: NexusGenScalars['UUID']; // UUID!
  }
  Proposal: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    discussions: NexusGenRootTypes['Discussion'][]; // [Discussion!]!
    id: string; // ID!
    state: NexusGenEnums['ProposalState']; // ProposalState!
    type: NexusGenEnums['ProposalType']; // ProposalType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Query: { // field return type
    common: NexusGenRootTypes['Common'] | null; // Common
    discussion: NexusGenRootTypes['Discussion'] | null; // Discussion
    generateUserAuthToken: string; // String!
    proposal: NexusGenRootTypes['Proposal'] | null; // Proposal
    user: NexusGenRootTypes['User'] | null; // User
  }
  Report: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    for: NexusGenEnums['ReportFor']; // ReportFor!
    id: NexusGenScalars['UUID']; // UUID!
    message: NexusGenRootTypes['DiscussionMessage']; // DiscussionMessage!
    messageId: NexusGenScalars['UUID']; // UUID!
    note: string; // String!
    reporter: NexusGenRootTypes['User']; // User!
    reporterId: string; // ID!
    reviewedOn: NexusGenScalars['DateTime'] | null; // DateTime
    status: NexusGenEnums['ReportStatus']; // ReportStatus!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Subscription: { // field return type
    discussionMessageCreated: NexusGenRootTypes['DiscussionMessage'] | null; // DiscussionMessage
    notificationCreated: NexusGenRootTypes['Notification'] | null; // Notification
    onProposalChange: NexusGenRootTypes['Proposal'] | null; // Proposal
  }
  User: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    discussionSubscriptions: NexusGenRootTypes['DiscussionSubscription'][]; // [DiscussionSubscription!]!
    displayName: string; // String!
    events: NexusGenRootTypes['Event'][]; // [Event!]!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    notificationTokens: NexusGenRootTypes['UserNotificationToken'][]; // [UserNotificationToken!]!
    notifications: NexusGenRootTypes['Notification'][]; // [Notification!]!
    proposals: NexusGenRootTypes['Proposal'][]; // [Proposal!]!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  UserNotificationToken: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    id: NexusGenScalars['UUID']; // UUID!
    lastUsed: NexusGenScalars['DateTime']; // DateTime!
    lastVerified: NexusGenScalars['DateTime']; // DateTime!
    state: NexusGenEnums['UserNotificationTokenState']; // UserNotificationTokenState!
    token: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Vote: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  BaseEntity: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: NexusGenScalars['UUID']; // UUID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
}

export interface NexusGenFieldTypeNames {
  Card: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    updatedAt: 'DateTime'
  }
  Common: { // field return type name
    createdAt: 'DateTime'
    discussions: 'Discussion'
    events: 'Event'
    id: 'ID'
    members: 'CommonMember'
    name: 'String'
    proposals: 'Proposal'
    reports: 'Report'
    updatedAt: 'DateTime'
    whitelisted: 'Boolean'
  }
  CommonMember: { // field return type name
    common: 'Common'
    commonId: 'ID'
    id: 'ID'
    proposals: 'Proposal'
    roles: 'CommonMemberRole'
    user: 'User'
    userId: 'ID'
  }
  Discussion: { // field return type name
    createdAt: 'DateTime'
    description: 'String'
    id: 'UUID'
    latestMessage: 'DateTime'
    messages: 'DiscussionMessage'
    topic: 'String'
    type: 'DiscussionType'
    updatedAt: 'DateTime'
  }
  DiscussionMessage: { // field return type name
    createdAt: 'DateTime'
    id: 'UUID'
    message: 'String'
    type: 'DiscussionMessageType'
    updatedAt: 'DateTime'
  }
  DiscussionSubscription: { // field return type name
    createdAt: 'DateTime'
    discussion: 'Discussion'
    discussionId: 'UUID'
    id: 'UUID'
    type: 'DiscussionSubscriptionType'
    updatedAt: 'DateTime'
    userId: 'String'
  }
  Event: { // field return type name
    commonId: 'ID'
    createdAt: 'DateTime'
    id: 'ID'
    payload: 'JSON'
    type: 'EventType'
    updatedAt: 'DateTime'
    userId: 'ID'
  }
  FundingProposal: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    updatedAt: 'DateTime'
  }
  JoinProposal: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    updatedAt: 'DateTime'
  }
  Link: { // field return type name
    title: 'String'
    url: 'String'
  }
  Mutation: { // field return type name
    changeDiscussionSubscriptionType: 'DiscussionSubscription'
    createCard: 'Card'
    createCommon: 'Common'
    createDiscussion: 'Discussion'
    createDiscussionMessage: 'DiscussionMessage'
    createFundingProposal: 'Proposal'
    createJoinProposal: 'Proposal'
    createUser: 'User'
    createUserNotificationToken: 'UserNotificationToken'
    createVote: 'Vote'
    finalizeProposal: 'Boolean'
    reportDiscussionMessage: 'Report'
    voidUserNotificationToken: 'UserNotificationToken'
  }
  Notification: { // field return type name
    common: 'Common'
    commonId: 'UUID'
    createdAt: 'DateTime'
    discussion: 'Discussion'
    discussionId: 'UUID'
    id: 'UUID'
    proposal: 'Proposal'
    proposalId: 'UUID'
    seenStatus: 'NotificationSeenStatus'
    show: 'Boolean'
    type: 'NotificationType'
    updatedAt: 'DateTime'
    user: 'User'
    userId: 'UUID'
  }
  Proposal: { // field return type name
    createdAt: 'DateTime'
    discussions: 'Discussion'
    id: 'ID'
    state: 'ProposalState'
    type: 'ProposalType'
    updatedAt: 'DateTime'
  }
  Query: { // field return type name
    common: 'Common'
    discussion: 'Discussion'
    generateUserAuthToken: 'String'
    proposal: 'Proposal'
    user: 'User'
  }
  Report: { // field return type name
    createdAt: 'DateTime'
    for: 'ReportFor'
    id: 'UUID'
    message: 'DiscussionMessage'
    messageId: 'UUID'
    note: 'String'
    reporter: 'User'
    reporterId: 'ID'
    reviewedOn: 'DateTime'
    status: 'ReportStatus'
    updatedAt: 'DateTime'
  }
  Subscription: { // field return type name
    discussionMessageCreated: 'DiscussionMessage'
    notificationCreated: 'Notification'
    onProposalChange: 'Proposal'
  }
  User: { // field return type name
    createdAt: 'DateTime'
    discussionSubscriptions: 'DiscussionSubscription'
    displayName: 'String'
    events: 'Event'
    firstName: 'String'
    id: 'ID'
    lastName: 'String'
    notificationTokens: 'UserNotificationToken'
    notifications: 'Notification'
    proposals: 'Proposal'
    updatedAt: 'DateTime'
  }
  UserNotificationToken: { // field return type name
    createdAt: 'DateTime'
    description: 'String'
    id: 'UUID'
    lastUsed: 'DateTime'
    lastVerified: 'DateTime'
    state: 'UserNotificationTokenState'
    token: 'String'
    updatedAt: 'DateTime'
  }
  Vote: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    updatedAt: 'DateTime'
  }
  BaseEntity: { // field return type name
    createdAt: 'DateTime'
    id: 'UUID'
    updatedAt: 'DateTime'
  }
}

export interface NexusGenArgTypes {
  Common: {
    discussions: { // args
      skip?: number | null; // Int
      take?: number | null; // Int
    }
    events: { // args
      orderBy?: NexusGenInputs['EventOrderByInput'] | null; // EventOrderByInput
      skip?: number | null; // Int
      take: number | null; // Int
    }
    members: { // args
      orderBy?: NexusGenInputs['CommonMemberOrderByInput'] | null; // CommonMemberOrderByInput
      skip?: number | null; // Int
      take?: number | null; // Int
    }
    proposals: { // args
      skip?: number | null; // Int
      take: number | null; // Int
      where?: NexusGenInputs['ProposalWhereInput'] | null; // ProposalWhereInput
    }
    reports: { // args
      where?: NexusGenInputs['ReportWhereInput'] | null; // ReportWhereInput
    }
  }
  CommonMember: {
    proposals: { // args
      skip?: number | null; // Int
      take: number | null; // Int
      where?: NexusGenInputs['ProposalWhereInput'] | null; // ProposalWhereInput
    }
  }
  Discussion: {
    messages: { // args
      orderBy: NexusGenInputs['DiscussionMessagesOrderByInput'] | null; // DiscussionMessagesOrderByInput
      skip?: number | null; // Int
      take: number | null; // Int
    }
  }
  Mutation: {
    changeDiscussionSubscriptionType: { // args
      id: string; // ID!
      type: NexusGenEnums['DiscussionSubscriptionType']; // DiscussionSubscriptionType!
    }
    createCard: { // args
      input: NexusGenInputs['CreateCardInput']; // CreateCardInput!
    }
    createCommon: { // args
      input: NexusGenInputs['CreateCommonInput']; // CreateCommonInput!
    }
    createDiscussion: { // args
      input: NexusGenInputs['CreateDiscussionInput']; // CreateDiscussionInput!
    }
    createDiscussionMessage: { // args
      input: NexusGenInputs['CreateDiscussionMessageInput']; // CreateDiscussionMessageInput!
    }
    createFundingProposal: { // args
      input: NexusGenInputs['CreateFundingProposalInput']; // CreateFundingProposalInput!
    }
    createJoinProposal: { // args
      input: NexusGenInputs['CreateJoinProposalInput']; // CreateJoinProposalInput!
    }
    createUser: { // args
      input: NexusGenInputs['CreateUserInput']; // CreateUserInput!
    }
    createUserNotificationToken: { // args
      input: NexusGenInputs['CreateUserNotificationTokenInput']; // CreateUserNotificationTokenInput!
    }
    createVote: { // args
      input: NexusGenInputs['CreateVoteInput']; // CreateVoteInput!
    }
    finalizeProposal: { // args
      proposalId: string; // ID!
    }
    reportDiscussionMessage: { // args
      input: NexusGenInputs['ReportDiscussionMessageInput']; // ReportDiscussionMessageInput!
    }
    voidUserNotificationToken: { // args
      tokenId: string; // ID!
    }
  }
  Proposal: {
    discussions: { // args
      skip?: number | null; // Int
      take?: number | null; // Int
    }
  }
  Query: {
    common: { // args
      where: NexusGenInputs['CommonWhereUniqueInput']; // CommonWhereUniqueInput!
    }
    discussion: { // args
      id: string; // ID!
    }
    generateUserAuthToken: { // args
      authId: string; // String!
    }
    proposal: { // args
      where: NexusGenInputs['ProposalWhereUniqueInput']; // ProposalWhereUniqueInput!
    }
    user: { // args
      userId?: string | null; // ID
    }
  }
  Subscription: {
    discussionMessageCreated: { // args
      discussionId: string; // ID!
    }
    onProposalChange: { // args
      proposalId: string; // ID!
    }
  }
  User: {
    discussionSubscriptions: { // args
      orderBy?: NexusGenInputs['DiscussionSubscriptionOrderByInput'] | null; // DiscussionSubscriptionOrderByInput
      skip?: number | null; // Int
      take: number | null; // Int
    }
    events: { // args
      orderBy?: NexusGenInputs['EventOrderByInput'] | null; // EventOrderByInput
      skip?: number | null; // Int
      take: number | null; // Int
    }
    notifications: { // args
      cursor?: NexusGenInputs['NotificationWhereUniqueInput'] | null; // NotificationWhereUniqueInput
      orderBy: NexusGenInputs['NotificationOrderByInput'] | null; // NotificationOrderByInput
      skip?: number | null; // Int
      take: number | null; // Int
    }
    proposals: { // args
      skip?: number | null; // Int
      take: number | null; // Int
      where?: NexusGenInputs['ProposalWhereInput'] | null; // ProposalWhereInput
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  BaseEntity: "Discussion" | "DiscussionMessage" | "DiscussionSubscription" | "Notification" | "Report" | "UserNotificationToken"
}

export interface NexusGenTypeInterfaces {
  Discussion: "BaseEntity"
  DiscussionMessage: "BaseEntity"
  DiscussionSubscription: "BaseEntity"
  Notification: "BaseEntity"
  Report: "BaseEntity"
  UserNotificationToken: "BaseEntity"
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "BaseEntity";

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: IRequestContext;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * The complexity for an individual field. Return a number
     * or a function that returns a number to specify the
     * complexity for this field.
     */
    complexity?: QueryComplexity<TypeName, FieldName>
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}