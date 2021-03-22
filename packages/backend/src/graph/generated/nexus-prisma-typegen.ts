import * as Typegen from 'nexus-plugin-prisma/typegen';
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
  ProposalDescription: Prisma.ProposalDescription
  Subscription: Prisma.Subscription
  Payment: Prisma.Payment
  Card: Prisma.Card
  CardBillingDetails: Prisma.CardBillingDetails
  Event: Prisma.Event
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'authId' | 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'email' | 'emailVerified' | 'cards' | 'events' | 'commonLinks' | 'payments' | 'subscriptions' | 'joinProposals' | 'fundingProposals'
      ordering: 'id' | 'authId' | 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'email' | 'emailVerified'
    }
    commons: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'name' | 'balance' | 'raised' | 'whitelisted' | 'fundingType' | 'fundingCooldown' | 'fundingMinimumAmount' | 'events' | 'members' | 'payments' | 'subscriptions' | 'joinProposals' | 'fundingProposals'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'name' | 'balance' | 'raised' | 'whitelisted' | 'fundingType' | 'fundingCooldown' | 'fundingMinimumAmount'
    }
    commonMembers: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'common' | 'user' | 'roles' | 'payments' | 'subscription' | 'fundingProposals' | 'commonId' | 'userId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'commonId' | 'userId'
    }
    joinProposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'state' | 'paymentState' | 'description' | 'user' | 'common' | 'payment' | 'subscription' | 'userId' | 'commonId' | 'subscriptionId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'state' | 'paymentState' | 'userId' | 'commonId' | 'subscriptionId'
    }
    fundingProposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'user' | 'common' | 'commonMember' | 'description' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'commonId' | 'commonMemberId'
    }
    proposalDescriptions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'join' | 'funding' | 'joinId' | 'fundingId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'link' | 'files' | 'images' | 'joinId' | 'fundingId'
    }
    subscriptions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'payments' | 'cardId' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'cardId' | 'userId' | 'commonId' | 'commonMemberId'
    }
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'subscription' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
    }
    cards: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'circleCardId' | 'createdAt' | 'updatedAt' | 'digits' | 'network' | 'cvvCheck' | 'avsCheck' | 'user' | 'payments' | 'subscriptions' | 'billingDetails' | 'userId'
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
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'circleCardId' | 'createdAt' | 'updatedAt' | 'digits' | 'network' | 'cvvCheck' | 'avsCheck' | 'user' | 'payments' | 'subscriptions' | 'billingDetails' | 'userId'
      ordering: 'id' | 'circleCardId' | 'createdAt' | 'updatedAt' | 'digits' | 'network' | 'cvvCheck' | 'avsCheck' | 'userId'
    }
    events: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId' | 'common' | 'user'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId'
    }
    commonLinks: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'common' | 'user' | 'roles' | 'payments' | 'subscription' | 'fundingProposals' | 'commonId' | 'userId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'commonId' | 'userId'
    }
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'subscription' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
    }
    subscriptions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'payments' | 'cardId' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'cardId' | 'userId' | 'commonId' | 'commonMemberId'
    }
    joinProposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'state' | 'paymentState' | 'description' | 'user' | 'common' | 'payment' | 'subscription' | 'userId' | 'commonId' | 'subscriptionId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'state' | 'paymentState' | 'userId' | 'commonId' | 'subscriptionId'
    }
    fundingProposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'user' | 'common' | 'commonMember' | 'description' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'commonId' | 'commonMemberId'
    }
  }
  Common: {
    events: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId' | 'common' | 'user'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'type' | 'payload' | 'commonId' | 'userId'
    }
    members: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'common' | 'user' | 'roles' | 'payments' | 'subscription' | 'fundingProposals' | 'commonId' | 'userId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'commonId' | 'userId'
    }
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'subscription' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
    }
    subscriptions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'payments' | 'cardId' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'cardId' | 'userId' | 'commonId' | 'commonMemberId'
    }
    joinProposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'state' | 'paymentState' | 'description' | 'user' | 'common' | 'payment' | 'subscription' | 'userId' | 'commonId' | 'subscriptionId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'state' | 'paymentState' | 'userId' | 'commonId' | 'subscriptionId'
    }
    fundingProposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'user' | 'common' | 'commonMember' | 'description' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'commonId' | 'commonMemberId'
    }
  }
  CommonMember: {
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'subscription' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
    }
    fundingProposals: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'user' | 'common' | 'commonMember' | 'description' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'commonId' | 'commonMemberId'
    }
  }
  JoinProposal: {

  }
  FundingProposal: {

  }
  ProposalDescription: {

  }
  Subscription: {
    proposal: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'state' | 'paymentState' | 'description' | 'user' | 'common' | 'payment' | 'subscription' | 'userId' | 'commonId' | 'subscriptionId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'funding' | 'fundingType' | 'state' | 'paymentState' | 'userId' | 'commonId' | 'subscriptionId'
    }
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'subscription' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
    }
  }
  Payment: {}
  Card: {
    payments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'subscription' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'subscriptionId' | 'proposalId' | 'userId' | 'commonId' | 'commonMemberId' | 'cardId'
    }
    subscriptions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'card' | 'user' | 'common' | 'commonMember' | 'proposal' | 'payments' | 'cardId' | 'userId' | 'commonId' | 'commonMemberId'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'cardId' | 'userId' | 'commonId' | 'commonMemberId'
    }
  }
  CardBillingDetails: {}
  Event: {}
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
    proposalDescription: 'ProposalDescription'
    proposalDescriptions: 'ProposalDescription'
    subscription: 'Subscription'
    subscriptions: 'Subscription'
    payment: 'Payment'
    payments: 'Payment'
    card: 'Card'
    cards: 'Card'
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
    createOneProposalDescription: 'ProposalDescription'
    updateOneProposalDescription: 'ProposalDescription'
    updateManyProposalDescription: 'AffectedRowsOutput'
    deleteOneProposalDescription: 'ProposalDescription'
    deleteManyProposalDescription: 'AffectedRowsOutput'
    upsertOneProposalDescription: 'ProposalDescription'
    createOneSubscription: 'Subscription'
    updateOneSubscription: 'Subscription'
    updateManySubscription: 'AffectedRowsOutput'
    deleteOneSubscription: 'Subscription'
    deleteManySubscription: 'AffectedRowsOutput'
    upsertOneSubscription: 'Subscription'
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
    authId: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    firstName: 'String'
    lastName: 'String'
    email: 'String'
    emailVerified: 'Boolean'
    cards: 'Card'
    events: 'Event'
    commonLinks: 'CommonMember'
    payments: 'Payment'
    subscriptions: 'Subscription'
    joinProposals: 'JoinProposal'
    fundingProposals: 'FundingProposal'
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
    joinProposals: 'JoinProposal'
    fundingProposals: 'FundingProposal'
  }
  CommonMember: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    common: 'Common'
    user: 'User'
    roles: 'CommonMemberRole'
    payments: 'Payment'
    subscription: 'Subscription'
    fundingProposals: 'FundingProposal'
    commonId: 'String'
    userId: 'String'
  }
  JoinProposal: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    funding: 'Int'
    fundingType: 'FundingType'
    state: 'ProposalState'
    paymentState: 'ProposalPaymentState'
    description: 'ProposalDescription'
    user: 'User'
    common: 'Common'
    payment: 'Payment'
    subscription: 'Subscription'
    userId: 'String'
    commonId: 'String'
    subscriptionId: 'String'
  }
  FundingProposal: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    user: 'User'
    common: 'Common'
    commonMember: 'CommonMember'
    description: 'ProposalDescription'
    userId: 'String'
    commonId: 'String'
    commonMemberId: 'String'
  }
  ProposalDescription: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    title: 'String'
    description: 'String'
    link: 'Json'
    files: 'Json'
    images: 'Json'
    join: 'JoinProposal'
    funding: 'FundingProposal'
    joinId: 'String'
    fundingId: 'String'
  }
  Subscription: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    card: 'Card'
    user: 'User'
    common: 'Common'
    commonMember: 'CommonMember'
    proposal: 'JoinProposal'
    payments: 'Payment'
    cardId: 'String'
    userId: 'String'
    commonId: 'String'
    commonMemberId: 'String'
  }
  Payment: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    card: 'Card'
    user: 'User'
    common: 'Common'
    commonMember: 'CommonMember'
    proposal: 'JoinProposal'
    subscription: 'Subscription'
    subscriptionId: 'String'
    proposalId: 'String'
    userId: 'String'
    commonId: 'String'
    commonMemberId: 'String'
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
  ProposalDescription: Typegen.NexusPrismaFields<'ProposalDescription'>
  Subscription: Typegen.NexusPrismaFields<'Subscription'>
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
  