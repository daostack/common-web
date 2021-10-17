import * as Apollo from "@apollo/client";
import { gql } from "@apollo/client";

import { Common, Discussion, Proposal, ProposalState, ProposalType, User } from "../shared/models";

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

export type BaseEntity = {
  id: Scalars["ID"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
};

export enum DiscussionType {
  ProposalDiscussion = "ProposalDiscussion",
  CommonDiscussion = "CommonDiscussion",
}

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

export type CommonMember = {
  __typename?: "CommonMember";
  /** The user ID of the member */
  userId: Scalars["ID"];
  /** The date, at witch the member joined the common */
  joinedAt?: Maybe<Scalars["Date"]>;
};

/** The common Types */

export type GetCommonsDataQuery = { __typename?: "Query" } & {
  commons?: Array<
    { __typename?: "Common" } & Common & {
        members?: Maybe<Array<Maybe<{ __typename?: "CommonMember" } & Pick<CommonMember, "userId">>>>;
      }
  >;
};

export const GetUserPendingCommonsDocument = gql`
  query PendingCommons {
    user {
      proposals(where: {state: ${ProposalState.Countdown}, type: ${ProposalType.JoinRequest}}) {
        common {
          id
          name
          image
          balance
          raised
          members {
            userId
            joinedAt: createdAt
            roles
            user {
              id
              displayName
              photoURL: photo
            }
          }
          rules
          links
          whitelisted
          action
          byline
          description
          fundingType
          fundingMinimumAmount
        }
      }
    }
  }
`;

export const GetUserCommonsDocument = gql`
  query MyCommons {
    user {
      commons {
        id
        name
        image
        balance
        raised
        members {
          userId
          joinedAt: createdAt
          roles
          user {
            id
            displayName
            photoURL: photo
          }
        }
        rules
        links
        whitelisted
        action
        byline
        description
        fundingType
        fundingMinimumAmount
      }
    }
  }
`;

export const GetCommonsDataDocument = gql`
  query getCommonsHomescreenData($paginate: PaginateInput! = { take: 10, skip: 0 }) {
    commons(paginate: $paginate) {
      id
      name
      image
      raised
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

export const GetUserCommonsDataDocument = gql`
  query getUserCommons {
    user(where: $where) {
      commons {
        id
        name
        image
        raised
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
      expiresAt
      user {
        id
        displayName
        lastName
        firstName
        photo
      }
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

export const CreateUserDocument = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(input: $user) {
      id
    }
  }
`;

export const UpdateUserDocument = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(input: $user) {
      uid: id
      firstName
      lastName
      email
      photoURL: photo
      country
      intro
      joinedAt: createdAt
    }
  }
`;

export const CreateJoinProposalDocument = gql`
  mutation CreateJoinProposal($proposal: CreateJoinProposalInput!) {
    createJoinProposal(input: $proposal) {
      id
      title
      commonId
      description
    }
  }
`;

export const CreateCardDocument = gql`
  mutation CreateJoinProposal($createCard: CreateCardInput!) {
    createCard(input: $createCard) {
      id
    }
  }
`;

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
          id
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

export type UserCommonWhereInput = {
  userId: Scalars["ID"] | undefined;
};

export type GetUserCommonsDataQueryVariables = Exact<{
  where: UserCommonWhereInput;
  paginate?: Pagination;
}>;

export type GetCommonDataQuery = {
  commons?: Maybe<Array<Common>>;
};

export type GetUserCommonsDataQuery = {
  commons?: Maybe<Array<Common>>;
};

export function useGetCommonDataQuery(
  baseOptions: Apollo.QueryHookOptions<GetCommonDataQuery, GetCommonDataQueryVariables>,
) {
  return Apollo.useQuery<GetCommonDataQuery, GetCommonDataQueryVariables>(GetCommonsDataDocument, baseOptions);
}

export function useGetUserCommonsDataQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserCommonsDataQuery, GetUserCommonsDataQueryVariables>,
) {
  return Apollo.useQuery<GetUserCommonsDataQuery, GetUserCommonsDataQueryVariables>(
    GetUserCommonsDataDocument,
    baseOptions,
  );
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
