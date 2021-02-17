import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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
  Date: any;
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  photoURL?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  tokens?: Maybe<Array<Maybe<Scalars['String']>>>;
  permissions?: Maybe<Array<Maybe<Scalars['String']>>>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  subscriptions?: Maybe<Array<Maybe<Subscription>>>;
};


export type UserProposalsArgs = {
  page?: Maybe<Scalars['Int']>;
};


export type UserSubscriptionsArgs = {
  page?: Maybe<Scalars['Int']>;
  status?: Maybe<SubscriptionStatus>;
};

export type Wire = {
  __typename?: 'Wire';
  /** The local ID of the payout */
  id: Scalars['ID'];
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  bank?: Maybe<WireBank>;
  billingDetails?: Maybe<WireBillingDetailsType>;
};

export type WireBank = {
  __typename?: 'WireBank';
  bankName?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};

export type WireBillingDetailsType = {
  __typename?: 'WireBillingDetailsType';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
};

export enum EventType {
  CommonCreated = 'commonCreated',
  CommonCreationFailed = 'commonCreationFailed',
  CommonWhitelisted = 'commonWhitelisted',
  CommonMemberAdded = 'commonMemberAdded',
  CommonMemberRemoved = 'commonMemberRemoved',
  CommonUpdated = 'commonUpdated',
  RequestToJoinCreated = 'requestToJoinCreated',
  RequestToJoinAccepted = 'requestToJoinAccepted',
  RequestToJoinRejected = 'requestToJoinRejected',
  RequestToJoinExecuted = 'requestToJoinExecuted',
  FundingRequestCreated = 'fundingRequestCreated',
  FundingRequestRejected = 'fundingRequestRejected',
  FundingRequestExecuted = 'fundingRequestExecuted',
  FundingRequestAccepted = 'fundingRequestAccepted',
  FundingRequestAcceptedInsufficientFunds = 'fundingRequestAcceptedInsufficientFunds',
  VoteCreated = 'voteCreated',
  PaymentCreated = 'paymentCreated',
  PaymentConfirmed = 'paymentConfirmed',
  PaymentFailed = 'paymentFailed',
  PaymentPaid = 'paymentPaid',
  PayoutCreated = 'payoutCreated',
  PayoutApproved = 'payoutApproved',
  PayoutExecuted = 'payoutExecuted',
  PayoutVoided = 'payoutVoided',
  PayoutCompleted = 'payoutCompleted',
  PayoutFailed = 'payoutFailed',
  CardCreated = 'cardCreated',
  DiscussionCreated = 'discussionCreated',
  MessageCreated = 'messageCreated',
  SubscriptionCreated = 'subscriptionCreated',
  SubscriptionPaymentCreated = 'subscriptionPaymentCreated',
  SubscriptionPaymentFailed = 'subscriptionPaymentFailed',
  SubscriptionPaymentConfirmed = 'subscriptionPaymentConfirmed',
  SubscriptionPaymentStuck = 'subscriptionPaymentStuck',
  SubscriptionCanceledByUser = 'subscriptionCanceledByUser',
  SubscriptionCanceledByPaymentFailure = 'subscriptionCanceledByPaymentFailure',
  MembershipRevoked = 'membershipRevoked'
}

export type Event = {
  __typename?: 'Event';
  /** The unique identifier of the event */
  id: Scalars['ID'];
  /** The type of the event */
  type: EventType;
  /** The date, at which the event was created */
  createdAt: Scalars['Date'];
  /** The date, at which the event was last updated */
  updatedAt: Scalars['Date'];
  /** The id of the object on which was acted to created the event */
  objectId?: Maybe<Scalars['ID']>;
  /** The id of the actor */
  userId?: Maybe<Scalars['ID']>;
};

export enum CommonContributionType {
  OneTime = 'oneTime',
  Monthly = 'monthly'
}

export type CommonMember = {
  __typename?: 'CommonMember';
  /** The user ID of the member */
  userId: Scalars['ID'];
  /** The date, at witch the member joined the common */
  joinedAt?: Maybe<Scalars['Date']>;
  user?: Maybe<User>;
};

export type CommonMetadata = {
  __typename?: 'CommonMetadata';
  byline: Scalars['String'];
  description: Scalars['String'];
  founderId: Scalars['String'];
  minFeeToJoin: Scalars['Int'];
  contributionType?: Maybe<CommonContributionType>;
};

export type Payout = {
  __typename?: 'Payout';
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  circlePayoutId?: Maybe<Scalars['String']>;
  amount: Scalars['Int'];
  executed?: Maybe<Scalars['Boolean']>;
  voided?: Maybe<Scalars['Boolean']>;
  status?: Maybe<PayoutStatus>;
  security?: Maybe<Array<Maybe<PayoutSecurity>>>;
  proposalIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
};

export type PayoutSecurity = {
  __typename?: 'PayoutSecurity';
  id?: Maybe<Scalars['Int']>;
  redemptionAttempts?: Maybe<Scalars['Int']>;
  redeemed?: Maybe<Scalars['Boolean']>;
};

export enum PayoutStatus {
  Pending = 'pending',
  Complete = 'complete',
  Failed = 'failed'
}

export type ExecutePayoutInput = {
  /** The ID of the the wire to witch the payout will be made */
  wireId: Scalars['ID'];
  /** List of the all proposals IDs that are in this batch */
  proposalIds: Array<Scalars['ID']>;
};

export enum ProposalType {
  FundingRequest = 'fundingRequest',
  Join = 'join'
}

export enum ProposalState {
  PassedInsufficientBalance = 'passedInsufficientBalance',
  Countdown = 'countdown',
  Passed = 'passed',
  Failed = 'failed'
}

export enum ProposalVoteOutcome {
  Approved = 'approved',
  Rejected = 'rejected'
}

export enum ProposalPaymentState {
  NotAttempted = 'notAttempted',
  NotRelevant = 'notRelevant',
  Confirmed = 'confirmed',
  Pending = 'pending',
  Failed = 'failed'
}

export enum ProposalFundingState {
  NotRelevant = 'notRelevant',
  NotAvailable = 'notAvailable',
  Available = 'available',
  Funded = 'funded'
}

/** The proposals type */
export type Proposal = {
  __typename?: 'Proposal';
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  commonId: Scalars['ID'];
  proposerId: Scalars['ID'];
  votesFor: Scalars['Int'];
  votesAgainst: Scalars['Int'];
  state: ProposalState;
  description: ProposalDescription;
  type: ProposalType;
  paymentState?: Maybe<ProposalPaymentState>;
  fundingState?: Maybe<ProposalFundingState>;
  /** Details about the funding request. Exists only on funding request proposals */
  fundingRequest?: Maybe<ProposalFunding>;
  /** Details about the join request. Exists only on join request proposals */
  join?: Maybe<ProposalJoin>;
  votes?: Maybe<Array<Maybe<ProposalVote>>>;
  common: Common;
  proposer: User;
};

export type ProposalDescription = {
  __typename?: 'ProposalDescription';
  title?: Maybe<Scalars['String']>;
  description: Scalars['String'];
};

export type ProposalFunding = {
  __typename?: 'ProposalFunding';
  amount: Scalars['Int'];
};

export type ProposalJoin = {
  __typename?: 'ProposalJoin';
  cardId: Scalars['ID'];
  funding: Scalars['Int'];
  fundingType?: Maybe<CommonContributionType>;
};

export type ProposalVote = {
  __typename?: 'ProposalVote';
  voteId: Scalars['ID'];
  voterId: Scalars['ID'];
  outcome: ProposalVoteOutcome;
  voter?: Maybe<User>;
};

export type Intention = {
  __typename?: 'Intention';
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  type: IntentionType;
  intention: Scalars['String'];
};

export enum IntentionType {
  Access = 'access',
  Request = 'request'
}

export type CreateIntentionInput = {
  type: IntentionType;
  intention: Scalars['String'];
};

export enum SubscriptionStatus {
  Pending = 'pending',
  Active = 'active',
  CanceledByUser = 'canceledByUser',
  CanceledByPaymentFailure = 'canceledByPaymentFailure',
  PaymentFailed = 'paymentFailed'
}

export type Subscription = {
  __typename?: 'Subscription';
  id: Scalars['ID'];
  cardId: Scalars['ID'];
  userId: Scalars['ID'];
  proposalId: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  charges: Scalars['Int'];
  amount: Scalars['Int'];
  lastChargedAt?: Maybe<Scalars['Date']>;
  dueDate?: Maybe<Scalars['Date']>;
  revoked: Scalars['Boolean'];
  status: SubscriptionStatus;
  metadata: SubscriptionMetadata;
};

export type SubscriptionMetadata = {
  __typename?: 'SubscriptionMetadata';
  common?: Maybe<SubscriptionMetadataCommon>;
};

export type SubscriptionMetadataCommon = {
  __typename?: 'SubscriptionMetadataCommon';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};

export type Statistics = {
  __typename?: 'Statistics';
  /** Commons, created on that date */
  newCommons?: Maybe<Scalars['Int']>;
  /** The amount of proposals with join type, created on that date */
  newJoinRequests?: Maybe<Scalars['Int']>;
  /** The amount of proposals with funding type, created on that date */
  newFundingRequests?: Maybe<Scalars['Int']>;
  /** The amount of discussions, started on that date */
  newDiscussions?: Maybe<Scalars['Int']>;
  /** The amount of new discussion messages, send on that date */
  newDiscussionMessages?: Maybe<Scalars['Int']>;
  commons?: Maybe<Scalars['Int']>;
  joinRequests?: Maybe<Scalars['Int']>;
  fundingRequests?: Maybe<Scalars['Int']>;
  users?: Maybe<Scalars['Int']>;
};


export type StatisticsJoinRequestsArgs = {
  onlyOpen?: Maybe<Scalars['Boolean']>;
};


export type StatisticsFundingRequestsArgs = {
  onlyOpen?: Maybe<Scalars['Boolean']>;
};

/** The common type */
export type Common = {
  __typename?: 'Common';
  /** The unique identifier of the common */
  id: Scalars['ID'];
  /** The date, at which the common was created */
  createdAt?: Maybe<Scalars['Date']>;
  /** The date, at which the common was last updated */
  updatedAt?: Maybe<Scalars['Date']>;
  /** The display name of the common */
  name: Scalars['String'];
  /** The currently available funds of the common */
  balance: Scalars['Int'];
  /** The total amount of money, raised by the common */
  raised: Scalars['Int'];
  metadata: CommonMetadata;
  members?: Maybe<Array<Maybe<CommonMember>>>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  openJoinRequests: Scalars['Int'];
  openFundingRequests: Scalars['Int'];
};


/** The common type */
export type CommonProposalsArgs = {
  page?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  wires?: Maybe<Array<Maybe<Wire>>>;
  event?: Maybe<Event>;
  events?: Maybe<Array<Maybe<Event>>>;
  common?: Maybe<Common>;
  commons?: Maybe<Array<Maybe<Common>>>;
  payout?: Maybe<Payout>;
  payouts?: Maybe<Array<Maybe<Payout>>>;
  proposal?: Maybe<Proposal>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  statistics?: Maybe<Statistics>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};


export type QueryWiresArgs = {
  page?: Maybe<Scalars['Int']>;
};


export type QueryEventArgs = {
  eventId: Scalars['ID'];
};


export type QueryEventsArgs = {
  last: Scalars['Int'];
  after?: Maybe<Scalars['Int']>;
};


export type QueryCommonArgs = {
  commonId: Scalars['ID'];
};


export type QueryCommonsArgs = {
  last?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Int']>;
};


export type QueryPayoutArgs = {
  id: Scalars['ID'];
};


export type QueryPayoutsArgs = {
  page?: Maybe<Scalars['Int']>;
};


export type QueryProposalArgs = {
  id: Scalars['ID'];
};


export type QueryProposalsArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  page?: Maybe<Scalars['Int']>;
  pageItems?: Maybe<Scalars['Int']>;
  type?: Maybe<ProposalType>;
  fundingState?: Maybe<ProposalFundingState>;
};

export type Mutation = {
  __typename?: 'Mutation';
  executePayouts?: Maybe<Payout>;
  createIntention?: Maybe<Intention>;
};


export type MutationExecutePayoutsArgs = {
  input: ExecutePayoutInput;
};


export type MutationCreateIntentionArgs = {
  input: CreateIntentionInput;
};

export type GetUserPermissionsQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetUserPermissionsQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'permissions'>
  )> }
);

export type GetCommonDetailsQueryVariables = Exact<{
  commonId: Scalars['ID'];
  page: Scalars['Int'];
}>;


export type GetCommonDetailsQuery = (
  { __typename?: 'Query' }
  & { common?: Maybe<(
    { __typename?: 'Common' }
    & Pick<Common, 'name' | 'createdAt' | 'updatedAt' | 'balance' | 'raised' | 'openFundingRequests' | 'openJoinRequests'>
    & { metadata: (
      { __typename?: 'CommonMetadata' }
      & Pick<CommonMetadata, 'byline' | 'description' | 'founderId' | 'contributionType'>
    ), members?: Maybe<Array<Maybe<(
      { __typename?: 'CommonMember' }
      & Pick<CommonMember, 'userId' | 'joinedAt'>
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'firstName' | 'lastName'>
      )> }
    )>>>, proposals?: Maybe<Array<Maybe<(
      { __typename?: 'Proposal' }
      & Pick<Proposal, 'id' | 'type'>
      & { fundingRequest?: Maybe<(
        { __typename?: 'ProposalFunding' }
        & Pick<ProposalFunding, 'amount'>
      )>, join?: Maybe<(
        { __typename?: 'ProposalJoin' }
        & Pick<ProposalJoin, 'fundingType' | 'funding'>
      )>, description: (
        { __typename?: 'ProposalDescription' }
        & Pick<ProposalDescription, 'description'>
      ) }
    )>>> }
  )> }
);

export type GetCommonsHomescreenDataQueryVariables = Exact<{
  last?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Int']>;
}>;


export type GetCommonsHomescreenDataQuery = (
  { __typename?: 'Query' }
  & { commons?: Maybe<Array<Maybe<(
    { __typename?: 'Common' }
    & Pick<Common, 'id' | 'name' | 'raised' | 'balance' | 'createdAt' | 'updatedAt'>
    & { metadata: (
      { __typename?: 'CommonMetadata' }
      & Pick<CommonMetadata, 'byline' | 'description' | 'contributionType'>
    ) }
  )>>> }
);

export type GetDashboardDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDashboardDataQuery = (
  { __typename?: 'Query' }
  & { statistics?: Maybe<(
    { __typename?: 'Statistics' }
    & Pick<Statistics, 'newCommons' | 'newJoinRequests' | 'newFundingRequests' | 'newDiscussions' | 'newDiscussionMessages'>
  )>, events?: Maybe<Array<Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'objectId' | 'type'>
  )>>> }
);

export type StatisticsQueryVariables = Exact<{ [key: string]: never; }>;


export type StatisticsQuery = (
  { __typename?: 'Query' }
  & { statistics?: Maybe<(
    { __typename?: 'Statistics' }
    & Pick<Statistics, 'users' | 'commons' | 'joinRequests' | 'fundingRequests'>
  )> }
);

export type CreateIntentionMutationVariables = Exact<{
  type: IntentionType;
  intention: Scalars['String'];
}>;


export type CreateIntentionMutation = (
  { __typename?: 'Mutation' }
  & { createIntention?: Maybe<(
    { __typename?: 'Intention' }
    & Pick<Intention, 'id'>
  )> }
);

export type GetProposalsSelectedForBatchQueryVariables = Exact<{
  ids: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetProposalsSelectedForBatchQuery = (
  { __typename?: 'Query' }
  & { proposals?: Maybe<Array<Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'state' | 'fundingState'>
    & { proposer: (
      { __typename?: 'User' }
      & Pick<User, 'firstName' | 'lastName'>
    ), description: (
      { __typename?: 'ProposalDescription' }
      & Pick<ProposalDescription, 'title' | 'description'>
    ), common: (
      { __typename?: 'Common' }
      & Pick<Common, 'name'>
    ), fundingRequest?: Maybe<(
      { __typename?: 'ProposalFunding' }
      & Pick<ProposalFunding, 'amount'>
    )> }
  )>>>, wires?: Maybe<Array<Maybe<(
    { __typename?: 'Wire' }
    & Pick<Wire, 'id' | 'description'>
    & { billingDetails?: Maybe<(
      { __typename?: 'WireBillingDetailsType' }
      & Pick<WireBillingDetailsType, 'city' | 'country' | 'name'>
    )> }
  )>>> }
);

export type ExecutePayoutMutationVariables = Exact<{
  input: ExecutePayoutInput;
}>;


export type ExecutePayoutMutation = (
  { __typename?: 'Mutation' }
  & { executePayouts?: Maybe<(
    { __typename?: 'Payout' }
    & Pick<Payout, 'id'>
  )> }
);

export type GetPayoutDetailsQueryVariables = Exact<{
  payoutId: Scalars['ID'];
}>;


export type GetPayoutDetailsQuery = (
  { __typename?: 'Query' }
  & { payout?: Maybe<(
    { __typename?: 'Payout' }
    & Pick<Payout, 'voided' | 'executed' | 'status'>
    & { proposals?: Maybe<Array<Maybe<(
      { __typename?: 'Proposal' }
      & Pick<Proposal, 'id'>
      & { fundingRequest?: Maybe<(
        { __typename?: 'ProposalFunding' }
        & Pick<ProposalFunding, 'amount'>
      )>, description: (
        { __typename?: 'ProposalDescription' }
        & Pick<ProposalDescription, 'title' | 'description'>
      ) }
    )>>>, security?: Maybe<Array<Maybe<(
      { __typename?: 'PayoutSecurity' }
      & Pick<PayoutSecurity, 'id' | 'redeemed' | 'redemptionAttempts'>
    )>>> }
  )> }
);

export type GetPayoutsPageDataQueryVariables = Exact<{
  fundingState?: Maybe<ProposalFundingState>;
  fundingRequestPage?: Maybe<Scalars['Int']>;
}>;


export type GetPayoutsPageDataQuery = (
  { __typename?: 'Query' }
  & { proposals?: Maybe<Array<Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'commonId' | 'proposerId' | 'type' | 'createdAt' | 'updatedAt' | 'state' | 'fundingState'>
    & { description: (
      { __typename?: 'ProposalDescription' }
      & Pick<ProposalDescription, 'title'>
    ), fundingRequest?: Maybe<(
      { __typename?: 'ProposalFunding' }
      & Pick<ProposalFunding, 'amount'>
    )> }
  )>>>, payouts?: Maybe<Array<Maybe<(
    { __typename?: 'Payout' }
    & Pick<Payout, 'id' | 'amount' | 'voided' | 'executed' | 'status' | 'proposalIds'>
  )>>> }
);

export type GetProposalDetailsQueryVariables = Exact<{
  proposalId: Scalars['ID'];
}>;


export type GetProposalDetailsQuery = (
  { __typename?: 'Query' }
  & { proposal?: Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'type' | 'createdAt' | 'updatedAt' | 'votesFor' | 'votesAgainst' | 'state' | 'paymentState'>
    & { join?: Maybe<(
      { __typename?: 'ProposalJoin' }
      & Pick<ProposalJoin, 'funding' | 'fundingType'>
    )>, fundingRequest?: Maybe<(
      { __typename?: 'ProposalFunding' }
      & Pick<ProposalFunding, 'amount'>
    )>, proposer: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
    ), common: (
      { __typename?: 'Common' }
      & { members?: Maybe<Array<Maybe<(
        { __typename?: 'CommonMember' }
        & Pick<CommonMember, 'userId'>
      )>>> }
    ), description: (
      { __typename?: 'ProposalDescription' }
      & Pick<ProposalDescription, 'description'>
    ), votes?: Maybe<Array<Maybe<(
      { __typename?: 'ProposalVote' }
      & Pick<ProposalVote, 'outcome'>
      & { voter?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName'>
      )> }
    )>>> }
  )> }
);

export type GetUserDetailsQueryQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetUserDetailsQueryQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'createdAt' | 'photoURL'>
    & { proposals?: Maybe<Array<Maybe<(
      { __typename?: 'Proposal' }
      & Pick<Proposal, 'id' | 'type' | 'state' | 'paymentState'>
      & { description: (
        { __typename?: 'ProposalDescription' }
        & Pick<ProposalDescription, 'title'>
      ) }
    )>>>, subscriptions?: Maybe<Array<Maybe<(
      { __typename?: 'Subscription' }
      & Pick<Subscription, 'id' | 'amount' | 'status' | 'revoked' | 'createdAt' | 'updatedAt' | 'lastChargedAt' | 'dueDate'>
      & { metadata: (
        { __typename?: 'SubscriptionMetadata' }
        & { common?: Maybe<(
          { __typename?: 'SubscriptionMetadataCommon' }
          & Pick<SubscriptionMetadataCommon, 'id' | 'name'>
        )> }
      ) }
    )>>> }
  )> }
);

export type GetUsersHomepageDataQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
}>;


export type GetUsersHomepageDataQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'photoURL' | 'email' | 'firstName' | 'lastName' | 'createdAt'>
  )>>> }
);


export const GetUserPermissionsDocument = gql`
    query getUserPermissions($userId: ID!) {
  user(id: $userId) {
    permissions
  }
}
    `;

/**
 * __useGetUserPermissionsQuery__
 *
 * To run a query within a React component, call `useGetUserPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPermissionsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserPermissionsQuery(baseOptions: Apollo.QueryHookOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>) {
        return Apollo.useQuery<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>(GetUserPermissionsDocument, baseOptions);
      }
export function useGetUserPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>) {
          return Apollo.useLazyQuery<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>(GetUserPermissionsDocument, baseOptions);
        }
export type GetUserPermissionsQueryHookResult = ReturnType<typeof useGetUserPermissionsQuery>;
export type GetUserPermissionsLazyQueryHookResult = ReturnType<typeof useGetUserPermissionsLazyQuery>;
export type GetUserPermissionsQueryResult = Apollo.QueryResult<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>;
export const GetCommonDetailsDocument = gql`
    query getCommonDetails($commonId: ID!, $page: Int!) {
  common(commonId: $commonId) {
    name
    createdAt
    updatedAt
    balance
    raised
    openFundingRequests
    openJoinRequests
    metadata {
      byline
      description
      founderId
      contributionType
    }
    members {
      userId
      joinedAt
      user {
        firstName
        lastName
      }
    }
    proposals(page: $page) {
      id
      type
      fundingRequest {
        amount
      }
      join {
        fundingType
        funding
      }
      description {
        description
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
 *      page: // value for 'page'
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
export const GetCommonsHomescreenDataDocument = gql`
    query getCommonsHomescreenData($last: Int, $after: Int) {
  commons(last: $last, after: $after) {
    id
    name
    raised
    balance
    createdAt
    updatedAt
    metadata {
      byline
      description
      contributionType
    }
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
 *      last: // value for 'last'
 *      after: // value for 'after'
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
export const GetDashboardDataDocument = gql`
    query getDashboardData {
  statistics {
    newCommons
    newJoinRequests
    newFundingRequests
    newDiscussions
    newDiscussionMessages
  }
  events(last: 10) {
    id
    createdAt
    updatedAt
    userId
    objectId
    type
  }
}
    `;

/**
 * __useGetDashboardDataQuery__
 *
 * To run a query within a React component, call `useGetDashboardDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDashboardDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDashboardDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDashboardDataQuery(baseOptions?: Apollo.QueryHookOptions<GetDashboardDataQuery, GetDashboardDataQueryVariables>) {
        return Apollo.useQuery<GetDashboardDataQuery, GetDashboardDataQueryVariables>(GetDashboardDataDocument, baseOptions);
      }
export function useGetDashboardDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDashboardDataQuery, GetDashboardDataQueryVariables>) {
          return Apollo.useLazyQuery<GetDashboardDataQuery, GetDashboardDataQueryVariables>(GetDashboardDataDocument, baseOptions);
        }
export type GetDashboardDataQueryHookResult = ReturnType<typeof useGetDashboardDataQuery>;
export type GetDashboardDataLazyQueryHookResult = ReturnType<typeof useGetDashboardDataLazyQuery>;
export type GetDashboardDataQueryResult = Apollo.QueryResult<GetDashboardDataQuery, GetDashboardDataQueryVariables>;
export const StatisticsDocument = gql`
    query Statistics {
  statistics {
    users
    commons
    joinRequests
    fundingRequests
  }
}
    `;

/**
 * __useStatisticsQuery__
 *
 * To run a query within a React component, call `useStatisticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStatisticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatisticsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStatisticsQuery(baseOptions?: Apollo.QueryHookOptions<StatisticsQuery, StatisticsQueryVariables>) {
        return Apollo.useQuery<StatisticsQuery, StatisticsQueryVariables>(StatisticsDocument, baseOptions);
      }
export function useStatisticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StatisticsQuery, StatisticsQueryVariables>) {
          return Apollo.useLazyQuery<StatisticsQuery, StatisticsQueryVariables>(StatisticsDocument, baseOptions);
        }
export type StatisticsQueryHookResult = ReturnType<typeof useStatisticsQuery>;
export type StatisticsLazyQueryHookResult = ReturnType<typeof useStatisticsLazyQuery>;
export type StatisticsQueryResult = Apollo.QueryResult<StatisticsQuery, StatisticsQueryVariables>;
export const CreateIntentionDocument = gql`
    mutation createIntention($type: IntentionType!, $intention: String!) {
  createIntention(input: {type: $type, intention: $intention}) {
    id
  }
}
    `;
export type CreateIntentionMutationFn = Apollo.MutationFunction<CreateIntentionMutation, CreateIntentionMutationVariables>;

/**
 * __useCreateIntentionMutation__
 *
 * To run a mutation, you first call `useCreateIntentionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateIntentionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createIntentionMutation, { data, loading, error }] = useCreateIntentionMutation({
 *   variables: {
 *      type: // value for 'type'
 *      intention: // value for 'intention'
 *   },
 * });
 */
export function useCreateIntentionMutation(baseOptions?: Apollo.MutationHookOptions<CreateIntentionMutation, CreateIntentionMutationVariables>) {
        return Apollo.useMutation<CreateIntentionMutation, CreateIntentionMutationVariables>(CreateIntentionDocument, baseOptions);
      }
export type CreateIntentionMutationHookResult = ReturnType<typeof useCreateIntentionMutation>;
export type CreateIntentionMutationResult = Apollo.MutationResult<CreateIntentionMutation>;
export type CreateIntentionMutationOptions = Apollo.BaseMutationOptions<CreateIntentionMutation, CreateIntentionMutationVariables>;
export const GetProposalsSelectedForBatchDocument = gql`
    query getProposalsSelectedForBatch($ids: [String!]!) {
  proposals(ids: $ids) {
    id
    state
    fundingState
    proposer {
      firstName
      lastName
    }
    description {
      title
      description
    }
    common {
      name
    }
    fundingRequest {
      amount
    }
  }
  wires {
    id
    description
    billingDetails {
      city
      country
      name
    }
  }
}
    `;

/**
 * __useGetProposalsSelectedForBatchQuery__
 *
 * To run a query within a React component, call `useGetProposalsSelectedForBatchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalsSelectedForBatchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalsSelectedForBatchQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useGetProposalsSelectedForBatchQuery(baseOptions: Apollo.QueryHookOptions<GetProposalsSelectedForBatchQuery, GetProposalsSelectedForBatchQueryVariables>) {
        return Apollo.useQuery<GetProposalsSelectedForBatchQuery, GetProposalsSelectedForBatchQueryVariables>(GetProposalsSelectedForBatchDocument, baseOptions);
      }
export function useGetProposalsSelectedForBatchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProposalsSelectedForBatchQuery, GetProposalsSelectedForBatchQueryVariables>) {
          return Apollo.useLazyQuery<GetProposalsSelectedForBatchQuery, GetProposalsSelectedForBatchQueryVariables>(GetProposalsSelectedForBatchDocument, baseOptions);
        }
export type GetProposalsSelectedForBatchQueryHookResult = ReturnType<typeof useGetProposalsSelectedForBatchQuery>;
export type GetProposalsSelectedForBatchLazyQueryHookResult = ReturnType<typeof useGetProposalsSelectedForBatchLazyQuery>;
export type GetProposalsSelectedForBatchQueryResult = Apollo.QueryResult<GetProposalsSelectedForBatchQuery, GetProposalsSelectedForBatchQueryVariables>;
export const ExecutePayoutDocument = gql`
    mutation ExecutePayout($input: ExecutePayoutInput!) {
  executePayouts(input: $input) {
    id
  }
}
    `;
export type ExecutePayoutMutationFn = Apollo.MutationFunction<ExecutePayoutMutation, ExecutePayoutMutationVariables>;

/**
 * __useExecutePayoutMutation__
 *
 * To run a mutation, you first call `useExecutePayoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecutePayoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executePayoutMutation, { data, loading, error }] = useExecutePayoutMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useExecutePayoutMutation(baseOptions?: Apollo.MutationHookOptions<ExecutePayoutMutation, ExecutePayoutMutationVariables>) {
        return Apollo.useMutation<ExecutePayoutMutation, ExecutePayoutMutationVariables>(ExecutePayoutDocument, baseOptions);
      }
export type ExecutePayoutMutationHookResult = ReturnType<typeof useExecutePayoutMutation>;
export type ExecutePayoutMutationResult = Apollo.MutationResult<ExecutePayoutMutation>;
export type ExecutePayoutMutationOptions = Apollo.BaseMutationOptions<ExecutePayoutMutation, ExecutePayoutMutationVariables>;
export const GetPayoutDetailsDocument = gql`
    query GetPayoutDetails($payoutId: ID!) {
  payout(id: $payoutId) {
    voided
    executed
    status
    proposals {
      id
      fundingRequest {
        amount
      }
      description {
        title
        description
      }
    }
    security {
      id
      redeemed
      redemptionAttempts
    }
  }
}
    `;

/**
 * __useGetPayoutDetailsQuery__
 *
 * To run a query within a React component, call `useGetPayoutDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPayoutDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPayoutDetailsQuery({
 *   variables: {
 *      payoutId: // value for 'payoutId'
 *   },
 * });
 */
export function useGetPayoutDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetPayoutDetailsQuery, GetPayoutDetailsQueryVariables>) {
        return Apollo.useQuery<GetPayoutDetailsQuery, GetPayoutDetailsQueryVariables>(GetPayoutDetailsDocument, baseOptions);
      }
export function useGetPayoutDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPayoutDetailsQuery, GetPayoutDetailsQueryVariables>) {
          return Apollo.useLazyQuery<GetPayoutDetailsQuery, GetPayoutDetailsQueryVariables>(GetPayoutDetailsDocument, baseOptions);
        }
export type GetPayoutDetailsQueryHookResult = ReturnType<typeof useGetPayoutDetailsQuery>;
export type GetPayoutDetailsLazyQueryHookResult = ReturnType<typeof useGetPayoutDetailsLazyQuery>;
export type GetPayoutDetailsQueryResult = Apollo.QueryResult<GetPayoutDetailsQuery, GetPayoutDetailsQueryVariables>;
export const GetPayoutsPageDataDocument = gql`
    query getPayoutsPageData($fundingState: ProposalFundingState, $fundingRequestPage: Int) {
  proposals(
    type: fundingRequest
    page: $fundingRequestPage
    fundingState: $fundingState
  ) {
    id
    commonId
    proposerId
    type
    description {
      title
    }
    fundingRequest {
      amount
    }
    createdAt
    updatedAt
    state
    fundingState
  }
  payouts {
    id
    amount
    voided
    executed
    status
    proposalIds
  }
}
    `;

/**
 * __useGetPayoutsPageDataQuery__
 *
 * To run a query within a React component, call `useGetPayoutsPageDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPayoutsPageDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPayoutsPageDataQuery({
 *   variables: {
 *      fundingState: // value for 'fundingState'
 *      fundingRequestPage: // value for 'fundingRequestPage'
 *   },
 * });
 */
export function useGetPayoutsPageDataQuery(baseOptions?: Apollo.QueryHookOptions<GetPayoutsPageDataQuery, GetPayoutsPageDataQueryVariables>) {
        return Apollo.useQuery<GetPayoutsPageDataQuery, GetPayoutsPageDataQueryVariables>(GetPayoutsPageDataDocument, baseOptions);
      }
export function useGetPayoutsPageDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPayoutsPageDataQuery, GetPayoutsPageDataQueryVariables>) {
          return Apollo.useLazyQuery<GetPayoutsPageDataQuery, GetPayoutsPageDataQueryVariables>(GetPayoutsPageDataDocument, baseOptions);
        }
export type GetPayoutsPageDataQueryHookResult = ReturnType<typeof useGetPayoutsPageDataQuery>;
export type GetPayoutsPageDataLazyQueryHookResult = ReturnType<typeof useGetPayoutsPageDataLazyQuery>;
export type GetPayoutsPageDataQueryResult = Apollo.QueryResult<GetPayoutsPageDataQuery, GetPayoutsPageDataQueryVariables>;
export const GetProposalDetailsDocument = gql`
    query getProposalDetails($proposalId: ID!) {
  proposal(id: $proposalId) {
    id
    join {
      funding
      fundingType
    }
    fundingRequest {
      amount
    }
    type
    createdAt
    updatedAt
    votesFor
    votesAgainst
    state
    paymentState
    proposer {
      id
      firstName
      lastName
    }
    common {
      members {
        userId
      }
    }
    description {
      description
    }
    votes {
      outcome
      voter {
        id
        firstName
        lastName
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
 *      proposalId: // value for 'proposalId'
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
export const GetUserDetailsQueryDocument = gql`
    query getUserDetailsQuery($userId: ID!) {
  user(id: $userId) {
    id
    firstName
    lastName
    email
    createdAt
    photoURL
    proposals {
      id
      type
      state
      paymentState
      description {
        title
      }
    }
    subscriptions {
      id
      amount
      metadata {
        common {
          id
          name
        }
      }
      status
      revoked
      createdAt
      updatedAt
      lastChargedAt
      dueDate
    }
  }
}
    `;

/**
 * __useGetUserDetailsQueryQuery__
 *
 * To run a query within a React component, call `useGetUserDetailsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDetailsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDetailsQueryQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserDetailsQueryQuery(baseOptions: Apollo.QueryHookOptions<GetUserDetailsQueryQuery, GetUserDetailsQueryQueryVariables>) {
        return Apollo.useQuery<GetUserDetailsQueryQuery, GetUserDetailsQueryQueryVariables>(GetUserDetailsQueryDocument, baseOptions);
      }
export function useGetUserDetailsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserDetailsQueryQuery, GetUserDetailsQueryQueryVariables>) {
          return Apollo.useLazyQuery<GetUserDetailsQueryQuery, GetUserDetailsQueryQueryVariables>(GetUserDetailsQueryDocument, baseOptions);
        }
export type GetUserDetailsQueryQueryHookResult = ReturnType<typeof useGetUserDetailsQueryQuery>;
export type GetUserDetailsQueryLazyQueryHookResult = ReturnType<typeof useGetUserDetailsQueryLazyQuery>;
export type GetUserDetailsQueryQueryResult = Apollo.QueryResult<GetUserDetailsQueryQuery, GetUserDetailsQueryQueryVariables>;
export const GetUsersHomepageDataDocument = gql`
    query getUsersHomepageData($page: Int = 1, $perPage: Int = 15) {
  users(page: $page, perPage: $perPage) {
    id
    photoURL
    email
    firstName
    lastName
    createdAt
  }
}
    `;

/**
 * __useGetUsersHomepageDataQuery__
 *
 * To run a query within a React component, call `useGetUsersHomepageDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersHomepageDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersHomepageDataQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetUsersHomepageDataQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>) {
        return Apollo.useQuery<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>(GetUsersHomepageDataDocument, baseOptions);
      }
export function useGetUsersHomepageDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>) {
          return Apollo.useLazyQuery<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>(GetUsersHomepageDataDocument, baseOptions);
        }
export type GetUsersHomepageDataQueryHookResult = ReturnType<typeof useGetUsersHomepageDataQuery>;
export type GetUsersHomepageDataLazyQueryHookResult = ReturnType<typeof useGetUsersHomepageDataLazyQuery>;
export type GetUsersHomepageDataQueryResult = Apollo.QueryResult<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>;