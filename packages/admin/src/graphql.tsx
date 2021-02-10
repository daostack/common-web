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

export type Common = {
  __typename?: 'Common';
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  name: Scalars['String'];
  balance: Scalars['Int'];
  raised: Scalars['Int'];
  metadata: CommonMetadata;
  members?: Maybe<Array<Maybe<CommonMember>>>;
};

export enum CommonContributionType {
  OneTime = 'oneTime',
  Monthly = 'monthly'
}

export type CommonMember = {
  __typename?: 'CommonMember';
  userId: Scalars['ID'];
  joinedAt?: Maybe<Scalars['Date']>;
};

export type CommonMetadata = {
  __typename?: 'CommonMetadata';
  byline: Scalars['String'];
  description: Scalars['String'];
  founderId: Scalars['String'];
  minFeeToJoin: Scalars['Int'];
  contributionType: CommonContributionType;
};


export type Event = {
  __typename?: 'Event';
  id: Scalars['ID'];
  type: EventType;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  objectId?: Maybe<Scalars['ID']>;
  userId?: Maybe<Scalars['ID']>;
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

export type Query = {
  __typename?: 'Query';
  today?: Maybe<Statistics>;
  event?: Maybe<Event>;
  events?: Maybe<Array<Maybe<Event>>>;
  common?: Maybe<Common>;
  commons?: Maybe<Array<Maybe<Common>>>;
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

export type Statistics = {
  __typename?: 'Statistics';
  newCommons?: Maybe<Scalars['Int']>;
  newJoinRequests?: Maybe<Scalars['Int']>;
  newFundingRequests?: Maybe<Scalars['Int']>;
  newDiscussions?: Maybe<Scalars['Int']>;
  newDiscussionMessages?: Maybe<Scalars['Int']>;
};

export type GetCommonDetailsQueryVariables = Exact<{
  commonId: Scalars['ID'];
}>;


export type GetCommonDetailsQuery = (
  { __typename?: 'Query' }
  & { common?: Maybe<(
    { __typename?: 'Common' }
    & Pick<Common, 'name' | 'createdAt' | 'updatedAt' | 'balance' | 'raised'>
    & { metadata: (
      { __typename?: 'CommonMetadata' }
      & Pick<CommonMetadata, 'byline' | 'description' | 'founderId' | 'contributionType'>
    ), members?: Maybe<Array<Maybe<(
      { __typename?: 'CommonMember' }
      & Pick<CommonMember, 'userId' | 'joinedAt'>
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


export const GetCommonDetailsDocument = gql`
    query getCommonDetails($commonId: ID!) {
  common(commonId: $commonId) {
    name
    createdAt
    updatedAt
    balance
    raised
    metadata {
      byline
      description
      founderId
      contributionType
    }
    members {
      userId
      joinedAt
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