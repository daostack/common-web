import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
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

  export enum CommonContributionType {
    OneTime = 'oneTime',
    Monthly = 'monthly'
  }

  export type CommonMetadata = {
    __typename?: 'CommonMetadata';
    byline: Scalars['String'];
    description: Scalars['String'];
    founderId: Scalars['String'];
    minFeeToJoin: Scalars['Int'];
    contributionType: CommonContributionType;
    action: Scalars['String'];
  };


  export type CommonMember = {
    __typename?: 'CommonMember';
    /** The user ID of the member */
    userId: Scalars['ID'];
    /** The date, at witch the member joined the common */
    joinedAt?: Maybe<Scalars['Date']>;
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
    members: Array<CommonMember>;
    proposals?: Maybe<Array<Maybe<Proposal>>>;
    openJoinRequests: Scalars['Int'];
    openFundingRequests: Scalars['Int'];
    image: Scalars['String'];
    register: Scalars['String'];
  };

  

export type GetCommonsDataQuery = (
    { __typename?: 'Query' }
    & { commons?: Array<(
      { __typename?: 'Common' }
      & Common
      & { members?: Maybe<Array<Maybe<(
        { __typename?: 'CommonMember' }
        & Pick<CommonMember, 'userId'>
      )>>>}
    )> }
  );

export const GetCommonsDataDocument = gql`
query getCommonsHomescreenData {
    commons {
      id
      name
      createdAt
      updatedAt
      whitelisted
      members {
        userId
      }
      proposals {
        id
      }
    }
  }
`;

export const GetUserPermissionsDocument = gql`
    query getUserPermissions($userId: ID!) {
  user(id: $userId) {
    permissions
  }
}
    `;

    export type GetUserPermissionsQuery = (
        { __typename?: 'Query' }
        & { user?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'permissions'>
        )> }
      );

      export function useGetCommonDataQuery() {
        return Apollo.useQuery<GetCommonsDataQuery>(GetCommonsDataDocument);
      }

      export type GetUserPermissionsQueryVariables = Exact<{
        userId: Scalars['ID'];
      }>;

      export function useGetUserPermissionsQuery(baseOptions: Apollo.QueryHookOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>) {
        return Apollo.useQuery<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>(GetUserPermissionsDocument, baseOptions);
      }