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
  event?: Maybe<Event>;
  events?: Maybe<Array<Maybe<Event>>>;
  common?: Maybe<Common>;
  commons?: Maybe<Array<Maybe<Common>>>;
  proposal?: Maybe<Proposal>;
  today?: Maybe<Statistics>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
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


export type QueryProposalArgs = {
  id: Scalars['ID'];
};

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
  & { today?: Maybe<(
    { __typename?: 'Statistics' }
    & Pick<Statistics, 'newCommons' | 'newJoinRequests' | 'newFundingRequests' | 'newDiscussions' | 'newDiscussionMessages'>
  )>, events?: Maybe<Array<Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'objectId' | 'type'>
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
  today {
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