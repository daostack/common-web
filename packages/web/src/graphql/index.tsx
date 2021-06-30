import * as Apollo from "@apollo/client";
import { gql } from "@apollo/client";

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Date: any;
};

export enum DiscussionMessageType {
  Message = "Message",
}

export enum DiscussionMessageFlag {
  Clear = "Clear",
  Reported = "Reported",
  Hidden = "Hidden",
}

export type BaseEntity = {
  id: Scalars["ID"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
};

export enum DiscussionType {
  ProposalDiscussion = "ProposalDiscussion",
  CommonDiscussion = "CommonDiscussion",
}

export type DiscussionMessage = BaseEntity & {
  id: Scalars["ID"];
  message: Scalars["String"];
  type: DiscussionMessageType;
  flag: DiscussionMessageFlag;
  reports: Array<Report>;
};

export enum ReportFor {
  Nudity = "Nudity",
  Violance = "Violance",
  Harassment = "Harassment",
  FalseNews = "FalseNews",
  Spam = "Spam",
  Hate = "Hate",
  Other = "Other",
}

enum ReportStatus {
  Active = "Active",
  Clossed = "Clossed",
}

export type Report = BaseEntity & {
  status: ReportStatus;
  for: ReportFor;
  note: Scalars["String"];
  reviewedOn: Scalars["Date"];
  reporterId: Scalars["ID"];
  reporter: User;
  messageId: Scalars["ID"];
};

export type Discussion = BaseEntity & {
  __typename?: "Discussion";
  id: Scalars["ID"];
  messages: Array<DiscussionMessage>;
  title: Scalars["String"];
  description: Scalars["String"];
  userId: Scalars["ID"];
  owner: User;
};

export enum ProposalType {
  FundingRequest = "fundingRequest",
  Join = "join",
}

export enum ProposalState {
  PassedInsufficientBalance = "passedInsufficientBalance",
  Countdown = "countdown",
  Passed = "passed",
  Failed = "failed",
}

export enum ProposalVoteOutcome {
  Approved = "approved",
  Rejected = "rejected",
}

export enum ProposalPaymentState {
  NotAttempted = "notAttempted",
  NotRelevant = "notRelevant",
  Confirmed = "confirmed",
  Pending = "pending",
  Failed = "failed",
}

export enum ProposalFundingState {
  NotRelevant = "notRelevant",
  NotAvailable = "notAvailable",
  Available = "available",
  Funded = "funded",
}

/** The proposals Types */
export type Proposal = {
  __typename?: "Proposal";
  id: Scalars["ID"];
  title: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  commonId: Scalars["ID"];
  proposerId: Scalars["ID"];
  votesFor: Scalars["Int"];
  votesAgainst: Scalars["Int"];
  state: ProposalState;
  description: ProposalDescription;
  type: ProposalType;
  paymentState?: Maybe<ProposalPaymentState>;
  fundingState?: Maybe<ProposalFundingState>;
  /** Details about the funding request. Exists only on funding request proposals */
  funding?: Maybe<ProposalFunding>;
  /** Details about the join request. Exists only on join request proposals */
  join?: Maybe<ProposalJoin>;
  votes?: Maybe<Array<Maybe<ProposalVote>>>;
  common: Common;
  proposer: User;
};

// countdownPeriod: number;
// createdAt: Time;
// description: { description: string; links: Rules[]; images: File[]; files: File[]; title: string };
// fundingRequest: { funded: boolean; amount: number };
// fundingState: string;
// id: string;
// moderation: Moderation;
// paymentState: string;
// proposerId: string;
// quietEndingPeriod: 10800;
// state: string;
// Types: string;
// updatedAt: Time;

export type ProposalDescription = {
  __typename?: "ProposalDescription";
  title?: Maybe<Scalars["String"]>;
  description: Scalars["String"];
};

export type ProposalFunding = {
  __typename?: "ProposalFunding";
  amount: Scalars["Int"];
};

export type ProposalJoin = {
  __typename?: "ProposalJoin";
  cardId: Scalars["ID"];
  funding: Scalars["Int"];
  fundingType?: Maybe<CommonContributionType>;
};

export type ProposalVote = {
  __typename?: "ProposalVote";
  voteId: Scalars["ID"];
  voterId: Scalars["ID"];
  outcome: ProposalVoteOutcome;
  voter?: Maybe<User>;
};

export enum SubscriptionStatus {
  Pending = "pending",
  Active = "active",
  CanceledByUser = "canceledByUser",
  CanceledByPaymentFailure = "canceledByPaymentFailure",
  PaymentFailed = "paymentFailed",
}

export type Subscription = {
  __typename?: "Subscription";
  id: Scalars["ID"];
  cardId: Scalars["ID"];
  userId: Scalars["ID"];
  proposalId: Scalars["ID"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  charges: Scalars["Int"];
  amount: Scalars["Int"];
  lastChargedAt?: Maybe<Scalars["Date"]>;
  dueDate?: Maybe<Scalars["Date"]>;
  revoked: Scalars["Boolean"];
  status: SubscriptionStatus;
  metadata: SubscriptionMetadata;
};

export type SubscriptionMetadata = {
  __typename?: "SubscriptionMetadata";
  common?: Maybe<SubscriptionMetadataCommon>;
};

export type SubscriptionMetadataCommon = {
  __typename?: "SubscriptionMetadataCommon";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  displayName?: Scalars["String"];
  firstName?: Scalars["String"];
  lastName?: Scalars["String"];
  email?: Scalars["String"];
  photo?: Scalars["String"];
  createdAt?: Maybe<Scalars["Date"]>;
  tokens?: Maybe<Array<Maybe<Scalars["String"]>>>;
  permissions?: Array<Scalars["String"]>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  subscriptions?: Maybe<Array<Maybe<Subscription>>>;
};

export enum CommonContributionType {
  OneTime = "oneTime",
  Monthly = "monthly",
}

export type CommonMetadata = {
  __typename?: "CommonMetadata";
  byline: Scalars["String"];
  description: Scalars["String"];
  founderId: Scalars["String"];
  minFeeToJoin: Scalars["Int"];
  contributionType: CommonContributionType;
  action: Scalars["String"];
};

export type CommonMember = {
  __typename?: "CommonMember";
  /** The user ID of the member */
  userId: Scalars["ID"];
  /** The date, at witch the member joined the common */
  joinedAt?: Maybe<Scalars["Date"]>;
};

export type Link = {
  title: Scalars["String"];
  url: Scalars["String"];
};

/** The common Types */
export type Common = {
  __typename?: "Common";
  /** The unique identifier of the common */
  id: Scalars["ID"];
  /** The date, at which the common was created */
  createdAt?: Maybe<Scalars["Date"]>;
  /** The date, at which the common was last updated */
  updatedAt?: Maybe<Scalars["Date"]>;
  /** The display name of the common */
  name: Scalars["String"];
  /** The currently available funds of the common */
  balance: Scalars["Int"];
  /** The total amount of money, raised by the common */
  raised: Scalars["Int"];
  byline: Scalars["String"];
  description: Scalars["String"];
  fundingMinimumAmount: Scalars["Int"];
  links: Array<Link>;
  fundingType: CommonContributionType;
  members: Array<CommonMember>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  openJoinRequests: Scalars["Int"];
  openFundingRequests: Scalars["Int"];
  image: Scalars["String"];
  register: Scalars["String"];
};

export type GetCommonsDataQuery = { __typename?: "Query" } & {
  commons?: Array<
    { __typename?: "Common" } & Common & {
        members?: Maybe<Array<Maybe<{ __typename?: "CommonMember" } & Pick<CommonMember, "userId">>>>;
      }
  >;
};

export const GetCommonsDataDocument = gql`
  query getCommonsHomescreenData($paginate: PaginateInput! = { take: 10, skip: 0 }) {
    commons(paginate: $paginate) {
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

export const GetCommonProposals = gql`
  query getCommonProposals($where: ProposalWhereInput, $paginate: PaginateInput! = { take: 10, skip: 0 }) {
    proposals(where: $where, paginate: $paginate) {
      id
      state
      createdAt
      updatedAt
      links
      files
      images
      votesFor
      votesAgainst
      title
      description
      discussions {
        id
        topic
        description
        latestMessage
        type
        userId
        owner {
          id
          displayName
          lastName
          firstName
        }
        messages {
          message
          type
          flag
          reports {
            status
            message {
              message
              type
              flag
            }
            for
            note
            reporterId
          }
        }
      }
      funding {
        id
        fundingState
        amount
      }
      join {
        id
        funding
        fundingType
        paymentState
      }
    }
  }
`;

export type DiscussionWhereInput = {
  commonId: Scalars["ID"];
};

export type GetCommonDiscussionsQueryVariables = Exact<{
  where: DiscussionWhereInput;
}>;

export const GetCommonDiscussions = gql`
  query getCommonDiscussions($where: DiscussionWhereInput, $paginate: PaginateInput! = { take: 10, skip: 0 }) {
    discussions(where: $where, paginate: $paginate) {
      id
      createdAt
      messages {
        id
        message
        createdAt
        updatedAt
        type
        flag
        owner {
          displayName
          firstName
          lastName
          photo
        }
      }
      title: topic
      description
      userId
      owner {
        firstName
        lastName
        displayName
        photo
      }
    }
  }
`;
export type GetCommonDiscussionsQuery = {
  discussions?: Maybe<Array<Discussion>>;
};

export function useGetCommonDiscussions(
  baseOptions: Apollo.QueryHookOptions<GetCommonDiscussionsQuery, GetCommonDiscussionsQueryVariables>,
) {
  return Apollo.useQuery<GetCommonDiscussionsQuery, GetCommonDiscussionsQueryVariables>(
    GetCommonDiscussions,
    baseOptions,
  );
}

export const GetDiscussionById = gql`
  query getDiscussionById($id: ID!) {
    discussion(id: $id) {
      id
      createdAt
      messages {
        id
        message
        createdAt
        updatedAt
        type
        flag
        owner {
          displayName
          firstName
          lastName
          photo
        }
      }
      title: topic
      description
      userId
      owner {
        firstName
        lastName
        displayName
        photo
      }
    }
  }
`;

export type GetCommonProposalsQuery = {
  proposals?: Maybe<Array<Proposal>>;
};

export const GetUserPermissionsDocument = gql`
  query getUserPermissions($userId: ID!) {
    user(id: $userId) {
      permissions
    }
  }
`;

export type GetCommonByIdQuery = {
  common?: Maybe<Common>;
};

export type CommonWhereUniqueInput = {
  id: Scalars["ID"];
};

export type GetCommonByIdQueryVariables = Exact<{
  where: CommonWhereUniqueInput;
}>;

export const GetCommonById = gql`
  query getCommon($where: CommonWhereUniqueInput!) {
    common(where: $where) {
      id
      description
      links
      image
      name
      byline
      balance
      fundingMinimumAmount
      fundingType
      raised
      members {
        id
        user {
          firstName
          lastName
          displayName
        }
      }
    }
  }
`;

export type GetUserPermissionsQuery = { __typename?: "Query" } & {
  user?: Maybe<{ __typename?: "User" } & Pick<User, "permissions">>;
};

export type GetCommonDataQueryVariables = Exact<{
  paginate?: Pagination;
}>;

export type GetCommonDataQuery = {
  commons?: Maybe<Array<Common>>;
};

export function useGetCommonDataQuery(
  baseOptions: Apollo.QueryHookOptions<GetCommonDataQuery, GetCommonDataQueryVariables>,
) {
  return Apollo.useQuery<GetCommonDataQuery, GetCommonDataQueryVariables>(GetCommonsDataDocument, baseOptions);
}

export type GetUserPermissionsQueryVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type Pagination = {
  skip: Scalars["Int"];
  take: Scalars["Int"];
};

export type GetCommonProposalsQueryVariables = Exact<{
  where: {
    type?: ProposalType;
    state?: ProposalState;
    commonId?: Scalars["ID"];
    commonMemberId?: Scalars["ID"];
    userId?: Scalars["ID"];
  };
  paginate?: Pagination;
}>;

export function useGetUserPermissionsQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>,
) {
  return Apollo.useQuery<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>(
    GetUserPermissionsDocument,
    baseOptions,
  );
}

export function useGetCommonProposals(
  baseOptions: Apollo.QueryHookOptions<GetCommonProposalsQuery, GetCommonProposalsQueryVariables>,
) {
  return Apollo.useQuery<GetCommonProposalsQuery, GetCommonProposalsQueryVariables>(GetCommonProposals, baseOptions);
}

export function useGetCommonById(
  baseOptions: Apollo.QueryHookOptions<GetCommonByIdQuery, GetCommonByIdQueryVariables>,
) {
  return Apollo.useQuery<GetCommonByIdQuery, GetCommonByIdQueryVariables>(GetCommonById, baseOptions);
}

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

export type LoadUserContextQuery = {
  user?: Pick<User, "id" | "firstName" | "lastName" | "displayName" | "email" | "photo" | "permissions">;
};

export type LoadUserContextQueryVariables = Exact<{ [key: string]: never }>;

export function useLoadUserContextQuery(
  baseOptions?: Apollo.QueryHookOptions<LoadUserContextQuery, LoadUserContextQueryVariables>,
) {
  return Apollo.useQuery<LoadUserContextQuery, LoadUserContextQueryVariables>(LoadUserContextDocument, baseOptions);
}
