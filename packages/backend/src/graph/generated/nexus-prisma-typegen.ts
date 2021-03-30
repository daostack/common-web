import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
    first?: boolean
    last?: boolean
    before?: boolean
    after?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'DateTime' | 'Json'

// Prisma model type definitions
interface PrismaModels {
  User: Prisma.User
  Common: Prisma.Common
  CommonMember: Prisma.CommonMember
  JoinProposal: Prisma.JoinProposal
  FundingProposal: Prisma.FundingProposal
  Proposal: Prisma.Proposal
  Subscription: Prisma.Subscription
  Vote: Prisma.Vote
  Payment: Prisma.Payment
  Card: Prisma.Card
  CardBillingDetails: Prisma.CardBillingDetails
  Event: Prisma.Event
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'email' | 'emailVerified' | 'cards' | 'events' | 'memberships' | 'payments' | 'proposals' | 'subscriptions'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'email' | 'emailVerified'
    }
    commons: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'name' | 'balance' | 'raised' | 'whitelisted' | 'fundingType' | 'fundingCooldown' | 'fundingMinimumAmount' | 'events' | 'members' | 'payments' | 'subscriptions' | 'proposals'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'name' | 'balance' | 'raised' | 'whitelisted' | 'fundingType' | 'fundingCooldown' | 'fundingMinimumAmount'
    }
    commonMembers: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'common' | 'user' | 'roles' | 'proposals' | 'commonId' | 'userId' | 'Vote'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'commonId' | 'userId'
    }
    joinProposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'paymentState' | 'card' | 'payment' | 'proposal' | 'subscription' | 'cardId' | 'subscriptionId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'paymentState' | 'cardId' | 'subscriptionId'
    }
    fundingProposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'proposal' | 'amount' | 'funded'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'amount' | 'funded'
    }
    proposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'ipAddress' | 'votes' | 'type' | 'state' | 'votesFor' | 'votesAgainst' | 'join' | 'funding' | 'user' | 'common' | 'commonMember' | 'joinId' | 'fundingId' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'ipAddress' | 'type' | 'state' | 'votesFor' | 'votesAgainst' | 'joinId' | 'fundingId' | 'userId' | 'commonId' | 'commonMemberId'
    }
    subscriptions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'proposal' | 'payments' | 'cardId' | 'userId' | 'commonId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'cardId' | 'userId' | 'commonId'
    }
    votes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'outcome' | 'proposal' | 'commonMember' | 'commonMemberId' | 'proposalId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'outcome' | 'commonMemberId' | 'proposalId'
    }
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'card' | 'user' | 'common' | 'join' | 'subscription' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
    }
    cards: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'circleCardId' | 'createdAt' | 'updatedAt' | 'digits' | 'network' | 'cvvCheck' | 'avsCheck' | 'user' | 'payments' | 'proposal' | 'subscriptions' | 'billingDetails' | 'userId'
      ordering: 'id' | 'circleCardId' | 'createdAt' | 'updatedAt' | 'digits' | 'network' | 'cvvCheck' | 'avsCheck' | 'userId'
    }
    cardBillingDetails: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'name' | 'line1' | 'line2' | 'city' | 'country' | 'district' | 'postalCode' | 'card' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'name' | 'line1' | 'line2' | 'city' | 'country' | 'district' | 'postalCode' | 'cardId'
    }
    events: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId' | 'common' | 'user'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId'
    }
  },
  User: {
    cards: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'circleCardId' | 'createdAt' | 'updatedAt' | 'digits' | 'network' | 'cvvCheck' | 'avsCheck' | 'user' | 'payments' | 'proposal' | 'subscriptions' | 'billingDetails' | 'userId'
      ordering: 'id' | 'circleCardId' | 'createdAt' | 'updatedAt' | 'digits' | 'network' | 'cvvCheck' | 'avsCheck' | 'userId'
    }
    events: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId' | 'common' | 'user'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId'
    }
    memberships: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'common' | 'user' | 'roles' | 'proposals' | 'commonId' | 'userId' | 'Vote'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'commonId' | 'userId'
    }
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'card' | 'user' | 'common' | 'join' | 'subscription' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
    }
    proposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'ipAddress' | 'votes' | 'type' | 'state' | 'votesFor' | 'votesAgainst' | 'join' | 'funding' | 'user' | 'common' | 'commonMember' | 'joinId' | 'fundingId' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'ipAddress' | 'type' | 'state' | 'votesFor' | 'votesAgainst' | 'joinId' | 'fundingId' | 'userId' | 'commonId' | 'commonMemberId'
    }
    subscriptions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'proposal' | 'payments' | 'cardId' | 'userId' | 'commonId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'cardId' | 'userId' | 'commonId'
    }
  }
  Common: {
    events: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId' | 'common' | 'user'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId'
    }
    members: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'common' | 'user' | 'roles' | 'proposals' | 'commonId' | 'userId' | 'Vote'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'commonId' | 'userId'
    }
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'card' | 'user' | 'common' | 'join' | 'subscription' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
    }
    subscriptions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'proposal' | 'payments' | 'cardId' | 'userId' | 'commonId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'cardId' | 'userId' | 'commonId'
    }
    proposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'ipAddress' | 'votes' | 'type' | 'state' | 'votesFor' | 'votesAgainst' | 'join' | 'funding' | 'user' | 'common' | 'commonMember' | 'joinId' | 'fundingId' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'ipAddress' | 'type' | 'state' | 'votesFor' | 'votesAgainst' | 'joinId' | 'fundingId' | 'userId' | 'commonId' | 'commonMemberId'
    }
  }
  CommonMember: {
    proposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'ipAddress' | 'votes' | 'type' | 'state' | 'votesFor' | 'votesAgainst' | 'join' | 'funding' | 'user' | 'common' | 'commonMember' | 'joinId' | 'fundingId' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'ipAddress' | 'type' | 'state' | 'votesFor' | 'votesAgainst' | 'joinId' | 'fundingId' | 'userId' | 'commonId' | 'commonMemberId'
    }
    Vote: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'outcome' | 'proposal' | 'commonMember' | 'commonMemberId' | 'proposalId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'outcome' | 'commonMemberId' | 'proposalId'
    }
  }
  JoinProposal: {
    payment: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'card' | 'user' | 'common' | 'join' | 'subscription' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
    }
  }
  FundingProposal: {

  }
  Proposal: {
    votes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'outcome' | 'proposal' | 'commonMember' | 'commonMemberId' | 'proposalId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'outcome' | 'commonMemberId' | 'proposalId'
    }
  }
  Subscription: {
    proposal: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'paymentState' | 'card' | 'payment' | 'proposal' | 'subscription' | 'cardId' | 'subscriptionId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'paymentState' | 'cardId' | 'subscriptionId'
    }
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'card' | 'user' | 'common' | 'join' | 'subscription' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
    }
  }
  Vote: {

  }
  Payment: {

  }
  Card: {
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'card' | 'user' | 'common' | 'join' | 'subscription' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'circlePaymentStatus' | 'circlePaymentId' | 'amount' | 'subscriptionId' | 'joinId' | 'userId' | 'commonId' | 'cardId'
    }
    proposal: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'paymentState' | 'card' | 'payment' | 'proposal' | 'subscription' | 'cardId' | 'subscriptionId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'paymentState' | 'cardId' | 'subscriptionId'
    }
    subscriptions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'proposal' | 'payments' | 'cardId' | 'userId' | 'commonId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'cardId' | 'userId' | 'commonId'
    }
  }
  CardBillingDetails: {

  }
  Event: {

  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    user: 'User'
    users: 'User'
    common: 'Common'
    commons: 'Common'
    commonMember: 'CommonMember'
    commonMembers: 'CommonMember'
    joinProposal: 'JoinProposal'
    joinProposals: 'JoinProposal'
    fundingProposal: 'FundingProposal'
    fundingProposals: 'FundingProposal'
    proposal: 'Proposal'
    proposals: 'Proposal'
    subscription: 'Subscription'
    subscriptions: 'Subscription'
    vote: 'Vote'
    votes: 'Vote'
    payment: 'Payment'
    payments: 'Payment'
    card: 'Card'
    cards: 'Card'
    cardBillingDetails: 'CardBillingDetails'
    cardBillingDetails: 'CardBillingDetails'
    event: 'Event'
    events: 'Event'
  },
  Mutation: {
    createOneUser: 'User'
    updateOneUser: 'User'
    updateManyUser: 'AffectedRowsOutput'
    deleteOneUser: 'User'
    deleteManyUser: 'AffectedRowsOutput'
    upsertOneUser: 'User'
    createOneCommon: 'Common'
    updateOneCommon: 'Common'
    updateManyCommon: 'AffectedRowsOutput'
    deleteOneCommon: 'Common'
    deleteManyCommon: 'AffectedRowsOutput'
    upsertOneCommon: 'Common'
    createOneCommonMember: 'CommonMember'
    updateOneCommonMember: 'CommonMember'
    updateManyCommonMember: 'AffectedRowsOutput'
    deleteOneCommonMember: 'CommonMember'
    deleteManyCommonMember: 'AffectedRowsOutput'
    upsertOneCommonMember: 'CommonMember'
    createOneJoinProposal: 'JoinProposal'
    updateOneJoinProposal: 'JoinProposal'
    updateManyJoinProposal: 'AffectedRowsOutput'
    deleteOneJoinProposal: 'JoinProposal'
    deleteManyJoinProposal: 'AffectedRowsOutput'
    upsertOneJoinProposal: 'JoinProposal'
    createOneFundingProposal: 'FundingProposal'
    updateOneFundingProposal: 'FundingProposal'
    updateManyFundingProposal: 'AffectedRowsOutput'
    deleteOneFundingProposal: 'FundingProposal'
    deleteManyFundingProposal: 'AffectedRowsOutput'
    upsertOneFundingProposal: 'FundingProposal'
    createOneProposal: 'Proposal'
    updateOneProposal: 'Proposal'
    updateManyProposal: 'AffectedRowsOutput'
    deleteOneProposal: 'Proposal'
    deleteManyProposal: 'AffectedRowsOutput'
    upsertOneProposal: 'Proposal'
    createOneSubscription: 'Subscription'
    updateOneSubscription: 'Subscription'
    updateManySubscription: 'AffectedRowsOutput'
    deleteOneSubscription: 'Subscription'
    deleteManySubscription: 'AffectedRowsOutput'
    upsertOneSubscription: 'Subscription'
    createOneVote: 'Vote'
    updateOneVote: 'Vote'
    updateManyVote: 'AffectedRowsOutput'
    deleteOneVote: 'Vote'
    deleteManyVote: 'AffectedRowsOutput'
    upsertOneVote: 'Vote'
    createOnePayment: 'Payment'
    updateOnePayment: 'Payment'
    updateManyPayment: 'AffectedRowsOutput'
    deleteOnePayment: 'Payment'
    deleteManyPayment: 'AffectedRowsOutput'
    upsertOnePayment: 'Payment'
    createOneCard: 'Card'
    updateOneCard: 'Card'
    updateManyCard: 'AffectedRowsOutput'
    deleteOneCard: 'Card'
    deleteManyCard: 'AffectedRowsOutput'
    upsertOneCard: 'Card'
    createOneCardBillingDetails: 'CardBillingDetails'
    updateOneCardBillingDetails: 'CardBillingDetails'
    updateManyCardBillingDetails: 'AffectedRowsOutput'
    deleteOneCardBillingDetails: 'CardBillingDetails'
    deleteManyCardBillingDetails: 'AffectedRowsOutput'
    upsertOneCardBillingDetails: 'CardBillingDetails'
    createOneEvent: 'Event'
    updateOneEvent: 'Event'
    updateManyEvent: 'AffectedRowsOutput'
    deleteOneEvent: 'Event'
    deleteManyEvent: 'AffectedRowsOutput'
    upsertOneEvent: 'Event'
  },
  User: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    firstName: 'String'
    lastName: 'String'
    email: 'String'
    emailVerified: 'Boolean'
    cards: 'Card'
    events: 'Event'
    memberships: 'CommonMember'
    payments: 'Payment'
    proposals: 'Proposal'
    subscriptions: 'Subscription'
  }
  Common: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    name: 'String'
    balance: 'Int'
    raised: 'Int'
    whitelisted: 'Boolean'
    fundingType: 'FundingType'
    fundingCooldown: 'DateTime'
    fundingMinimumAmount: 'Int'
    events: 'Event'
    members: 'CommonMember'
    payments: 'Payment'
    subscriptions: 'Subscription'
    proposals: 'Proposal'
  }
  CommonMember: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    common: 'Common'
    user: 'User'
    roles: 'CommonMemberRole'
    proposals: 'Proposal'
    commonId: 'String'
    userId: 'String'
    Vote: 'Vote'
  }
  JoinProposal: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    funding: 'Int'
    fundingType: 'FundingType'
    paymentState: 'ProposalPaymentState'
    card: 'Card'
    payment: 'Payment'
    proposal: 'Proposal'
    subscription: 'Subscription'
    cardId: 'String'
    subscriptionId: 'String'
  }
  FundingProposal: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    proposal: 'Proposal'
    amount: 'Int'
    funded: 'Boolean'
  }
  Proposal: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    title: 'String'
    description: 'String'
    link: 'Json'
    files: 'Json'
    images: 'Json'
    ipAddress: 'String'
    votes: 'Vote'
    type: 'ProposalType'
    state: 'ProposalState'
    votesFor: 'Int'
    votesAgainst: 'Int'
    join: 'JoinProposal'
    funding: 'FundingProposal'
    user: 'User'
    common: 'Common'
    commonMember: 'CommonMember'
    joinId: 'String'
    fundingId: 'String'
    userId: 'String'
    commonId: 'String'
    commonMemberId: 'String'
  }
  Subscription: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    card: 'Card'
    user: 'User'
    common: 'Common'
    proposal: 'JoinProposal'
    payments: 'Payment'
    cardId: 'String'
    userId: 'String'
    commonId: 'String'
  }
  Vote: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    outcome: 'VoteOutcome'
    proposal: 'Proposal'
    commonMember: 'CommonMember'
    commonMemberId: 'String'
    proposalId: 'String'
  }
  Payment: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    type: 'PaymentType'
    status: 'PaymentStatus'
    circlePaymentStatus: 'PaymentCircleStatus'
    circlePaymentId: 'String'
    amount: 'Int'
    card: 'Card'
    user: 'User'
    common: 'Common'
    join: 'JoinProposal'
    subscription: 'Subscription'
    subscriptionId: 'String'
    joinId: 'String'
    userId: 'String'
    commonId: 'String'
    cardId: 'String'
  }
  Card: {
    id: 'String'
    circleCardId: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    digits: 'String'
    network: 'CardNetwork'
    cvvCheck: 'String'
    avsCheck: 'String'
    user: 'User'
    payments: 'Payment'
    proposal: 'JoinProposal'
    subscriptions: 'Subscription'
    billingDetails: 'CardBillingDetails'
    userId: 'String'
  }
  CardBillingDetails: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    name: 'String'
    line1: 'String'
    line2: 'String'
    city: 'String'
    country: 'String'
    district: 'String'
    postalCode: 'String'
    card: 'Card'
    cardId: 'String'
  }
  Event: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    type: 'EventType'
    payload: 'Json'
    commonId: 'String'
    userId: 'String'
    common: 'Common'
    user: 'User'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  User: Typegen.NexusPrismaFields<'User'>
  Common: Typegen.NexusPrismaFields<'Common'>
  CommonMember: Typegen.NexusPrismaFields<'CommonMember'>
  JoinProposal: Typegen.NexusPrismaFields<'JoinProposal'>
  FundingProposal: Typegen.NexusPrismaFields<'FundingProposal'>
  Proposal: Typegen.NexusPrismaFields<'Proposal'>
  Subscription: Typegen.NexusPrismaFields<'Subscription'>
  Vote: Typegen.NexusPrismaFields<'Vote'>
  Payment: Typegen.NexusPrismaFields<'Payment'>
  Card: Typegen.NexusPrismaFields<'Card'>
  CardBillingDetails: Typegen.NexusPrismaFields<'CardBillingDetails'>
  Event: Typegen.NexusPrismaFields<'Event'>
  Query: Typegen.NexusPrismaFields<'Query'>
  Mutation: Typegen.NexusPrismaFields<'Mutation'>
}

interface NexusPrismaGenTypes {
  inputs: NexusPrismaInputs
  outputs: NexusPrismaOutputs
  methods: NexusPrismaMethods
  models: PrismaModels
  pagination: Pagination
  scalars: CustomScalars
}

declare global {
  interface NexusPrismaGen extends NexusPrismaGenTypes {}

  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = Typegen.GetNexusPrisma<TypeName, ModelOrCrud>;
}
  