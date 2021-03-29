/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { IRequestContext } from "./../context"
import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Date";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
  }
}
declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
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
  BoolFilter: { // input type
    equals?: boolean | null; // Boolean
    not?: NexusGenInputs['NestedBoolFilter'] | null; // NestedBoolFilter
  }
  CardBillingDetailsWhereInput: { // input type
    AND?: NexusGenInputs['CardBillingDetailsWhereInput'][] | null; // [CardBillingDetailsWhereInput!]
    NOT?: NexusGenInputs['CardBillingDetailsWhereInput'][] | null; // [CardBillingDetailsWhereInput!]
    OR?: NexusGenInputs['CardBillingDetailsWhereInput'][] | null; // [CardBillingDetailsWhereInput!]
    card?: NexusGenInputs['CardWhereInput'] | null; // CardWhereInput
    cardId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    city?: NexusGenInputs['StringFilter'] | null; // StringFilter
    country?: NexusGenInputs['StringFilter'] | null; // StringFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    district?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    line1?: NexusGenInputs['StringFilter'] | null; // StringFilter
    line2?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    postalCode?: NexusGenInputs['StringFilter'] | null; // StringFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  CardListRelationFilter: { // input type
    every?: NexusGenInputs['CardWhereInput'] | null; // CardWhereInput
    none?: NexusGenInputs['CardWhereInput'] | null; // CardWhereInput
    some?: NexusGenInputs['CardWhereInput'] | null; // CardWhereInput
  }
  CardWhereInput: { // input type
    AND?: NexusGenInputs['CardWhereInput'][] | null; // [CardWhereInput!]
    NOT?: NexusGenInputs['CardWhereInput'][] | null; // [CardWhereInput!]
    OR?: NexusGenInputs['CardWhereInput'][] | null; // [CardWhereInput!]
    avsCheck?: NexusGenInputs['StringFilter'] | null; // StringFilter
    billingDetails?: NexusGenInputs['CardBillingDetailsWhereInput'] | null; // CardBillingDetailsWhereInput
    circleCardId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    cvvCheck?: NexusGenInputs['StringFilter'] | null; // StringFilter
    digits?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    network?: NexusGenInputs['EnumCardNetworkFilter'] | null; // EnumCardNetworkFilter
    payments?: NexusGenInputs['PaymentListRelationFilter'] | null; // PaymentListRelationFilter
    subscriptions?: NexusGenInputs['SubscriptionListRelationFilter'] | null; // SubscriptionListRelationFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  CommonMemberListRelationFilter: { // input type
    every?: NexusGenInputs['CommonMemberWhereInput'] | null; // CommonMemberWhereInput
    none?: NexusGenInputs['CommonMemberWhereInput'] | null; // CommonMemberWhereInput
    some?: NexusGenInputs['CommonMemberWhereInput'] | null; // CommonMemberWhereInput
  }
  CommonMemberWhereInput: { // input type
    AND?: NexusGenInputs['CommonMemberWhereInput'][] | null; // [CommonMemberWhereInput!]
    NOT?: NexusGenInputs['CommonMemberWhereInput'][] | null; // [CommonMemberWhereInput!]
    OR?: NexusGenInputs['CommonMemberWhereInput'][] | null; // [CommonMemberWhereInput!]
    Vote?: NexusGenInputs['VoteListRelationFilter'] | null; // VoteListRelationFilter
    common?: NexusGenInputs['CommonWhereInput'] | null; // CommonWhereInput
    commonId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    payments?: NexusGenInputs['PaymentListRelationFilter'] | null; // PaymentListRelationFilter
    proposals?: NexusGenInputs['ProposalListRelationFilter'] | null; // ProposalListRelationFilter
    roles?: NexusGenInputs['EnumCommonMemberRoleNullableListFilter'] | null; // EnumCommonMemberRoleNullableListFilter
    subscription?: NexusGenInputs['SubscriptionWhereInput'] | null; // SubscriptionWhereInput
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  CommonWhereInput: { // input type
    AND?: NexusGenInputs['CommonWhereInput'][] | null; // [CommonWhereInput!]
    NOT?: NexusGenInputs['CommonWhereInput'][] | null; // [CommonWhereInput!]
    OR?: NexusGenInputs['CommonWhereInput'][] | null; // [CommonWhereInput!]
    balance?: NexusGenInputs['IntFilter'] | null; // IntFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    events?: NexusGenInputs['EventListRelationFilter'] | null; // EventListRelationFilter
    fundingCooldown?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    fundingMinimumAmount?: NexusGenInputs['IntFilter'] | null; // IntFilter
    fundingType?: NexusGenInputs['EnumFundingTypeFilter'] | null; // EnumFundingTypeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    members?: NexusGenInputs['CommonMemberListRelationFilter'] | null; // CommonMemberListRelationFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    payments?: NexusGenInputs['PaymentListRelationFilter'] | null; // PaymentListRelationFilter
    proposals?: NexusGenInputs['ProposalListRelationFilter'] | null; // ProposalListRelationFilter
    raised?: NexusGenInputs['IntFilter'] | null; // IntFilter
    subscriptions?: NexusGenInputs['SubscriptionListRelationFilter'] | null; // SubscriptionListRelationFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    whitelisted?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
  }
  CommonWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  CreateCardInput: { // input type
    billingDetails: NexusGenInputs['BillingDetailsInput']; // BillingDetailsInput!
    encryptedData: string; // String!
    expMonth: number; // Int!
    expYear: number; // Int!
    keyId: string; // String!
  }
  CreateCommonInput: { // input type
    fundingCooldown: NexusGenScalars['Date']; // Date!
    fundingMinimumAmount: number; // Int!
    fundingType: NexusGenEnums['FundingType']; // FundingType!
    name: string; // String!
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
  CreateVoteInput: { // input type
    outcome: NexusGenEnums['VoteOutcome']; // VoteOutcome!
    proposalId: string; // ID!
  }
  DateTimeFilter: { // input type
    equals?: NexusGenScalars['DateTime'] | null; // DateTime
    gt?: NexusGenScalars['DateTime'] | null; // DateTime
    gte?: NexusGenScalars['DateTime'] | null; // DateTime
    in?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
    lt?: NexusGenScalars['DateTime'] | null; // DateTime
    lte?: NexusGenScalars['DateTime'] | null; // DateTime
    not?: NexusGenInputs['NestedDateTimeFilter'] | null; // NestedDateTimeFilter
    notIn?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
  }
  EnumCardNetworkFilter: { // input type
    equals?: NexusGenEnums['CardNetwork'] | null; // CardNetwork
    in?: NexusGenEnums['CardNetwork'][] | null; // [CardNetwork!]
    not?: NexusGenInputs['NestedEnumCardNetworkFilter'] | null; // NestedEnumCardNetworkFilter
    notIn?: NexusGenEnums['CardNetwork'][] | null; // [CardNetwork!]
  }
  EnumCommonMemberRoleNullableListFilter: { // input type
    equals?: NexusGenEnums['CommonMemberRole'][] | null; // [CommonMemberRole!]
    has?: NexusGenEnums['CommonMemberRole'] | null; // CommonMemberRole
    hasEvery?: NexusGenEnums['CommonMemberRole'][] | null; // [CommonMemberRole!]
    hasSome?: NexusGenEnums['CommonMemberRole'][] | null; // [CommonMemberRole!]
    isEmpty?: boolean | null; // Boolean
  }
  EnumEventTypeFilter: { // input type
    equals?: NexusGenEnums['EventType'] | null; // EventType
    in?: NexusGenEnums['EventType'][] | null; // [EventType!]
    not?: NexusGenInputs['NestedEnumEventTypeFilter'] | null; // NestedEnumEventTypeFilter
    notIn?: NexusGenEnums['EventType'][] | null; // [EventType!]
  }
  EnumFundingTypeFilter: { // input type
    equals?: NexusGenEnums['FundingType'] | null; // FundingType
    in?: NexusGenEnums['FundingType'][] | null; // [FundingType!]
    not?: NexusGenInputs['NestedEnumFundingTypeFilter'] | null; // NestedEnumFundingTypeFilter
    notIn?: NexusGenEnums['FundingType'][] | null; // [FundingType!]
  }
  EnumProposalPaymentStateFilter: { // input type
    equals?: NexusGenEnums['ProposalPaymentState'] | null; // ProposalPaymentState
    in?: NexusGenEnums['ProposalPaymentState'][] | null; // [ProposalPaymentState!]
    not?: NexusGenInputs['NestedEnumProposalPaymentStateFilter'] | null; // NestedEnumProposalPaymentStateFilter
    notIn?: NexusGenEnums['ProposalPaymentState'][] | null; // [ProposalPaymentState!]
  }
  EnumProposalStateFilter: { // input type
    equals?: NexusGenEnums['ProposalState'] | null; // ProposalState
    in?: NexusGenEnums['ProposalState'][] | null; // [ProposalState!]
    not?: NexusGenInputs['NestedEnumProposalStateFilter'] | null; // NestedEnumProposalStateFilter
    notIn?: NexusGenEnums['ProposalState'][] | null; // [ProposalState!]
  }
  EnumProposalTypeFilter: { // input type
    equals?: NexusGenEnums['ProposalType'] | null; // ProposalType
    in?: NexusGenEnums['ProposalType'][] | null; // [ProposalType!]
    not?: NexusGenInputs['NestedEnumProposalTypeFilter'] | null; // NestedEnumProposalTypeFilter
    notIn?: NexusGenEnums['ProposalType'][] | null; // [ProposalType!]
  }
  EnumVoteOutcomeFilter: { // input type
    equals?: NexusGenEnums['VoteOutcome'] | null; // VoteOutcome
    in?: NexusGenEnums['VoteOutcome'][] | null; // [VoteOutcome!]
    not?: NexusGenInputs['NestedEnumVoteOutcomeFilter'] | null; // NestedEnumVoteOutcomeFilter
    notIn?: NexusGenEnums['VoteOutcome'][] | null; // [VoteOutcome!]
  }
  EventListRelationFilter: { // input type
    every?: NexusGenInputs['EventWhereInput'] | null; // EventWhereInput
    none?: NexusGenInputs['EventWhereInput'] | null; // EventWhereInput
    some?: NexusGenInputs['EventWhereInput'] | null; // EventWhereInput
  }
  EventWhereInput: { // input type
    AND?: NexusGenInputs['EventWhereInput'][] | null; // [EventWhereInput!]
    NOT?: NexusGenInputs['EventWhereInput'][] | null; // [EventWhereInput!]
    OR?: NexusGenInputs['EventWhereInput'][] | null; // [EventWhereInput!]
    common?: NexusGenInputs['CommonWhereInput'] | null; // CommonWhereInput
    commonId?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    payload?: NexusGenInputs['JsonNullableFilter'] | null; // JsonNullableFilter
    type?: NexusGenInputs['EnumEventTypeFilter'] | null; // EnumEventTypeFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
  }
  FundingProposalWhereInput: { // input type
    AND?: NexusGenInputs['FundingProposalWhereInput'][] | null; // [FundingProposalWhereInput!]
    NOT?: NexusGenInputs['FundingProposalWhereInput'][] | null; // [FundingProposalWhereInput!]
    OR?: NexusGenInputs['FundingProposalWhereInput'][] | null; // [FundingProposalWhereInput!]
    amount?: NexusGenInputs['IntFilter'] | null; // IntFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    funded?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    proposal?: NexusGenInputs['ProposalWhereInput'] | null; // ProposalWhereInput
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  IntFilter: { // input type
    equals?: number | null; // Int
    gt?: number | null; // Int
    gte?: number | null; // Int
    in?: number[] | null; // [Int!]
    lt?: number | null; // Int
    lte?: number | null; // Int
    not?: NexusGenInputs['NestedIntFilter'] | null; // NestedIntFilter
    notIn?: number[] | null; // [Int!]
  }
  JoinProposalListRelationFilter: { // input type
    every?: NexusGenInputs['JoinProposalWhereInput'] | null; // JoinProposalWhereInput
    none?: NexusGenInputs['JoinProposalWhereInput'] | null; // JoinProposalWhereInput
    some?: NexusGenInputs['JoinProposalWhereInput'] | null; // JoinProposalWhereInput
  }
  JoinProposalWhereInput: { // input type
    AND?: NexusGenInputs['JoinProposalWhereInput'][] | null; // [JoinProposalWhereInput!]
    NOT?: NexusGenInputs['JoinProposalWhereInput'][] | null; // [JoinProposalWhereInput!]
    OR?: NexusGenInputs['JoinProposalWhereInput'][] | null; // [JoinProposalWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    funding?: NexusGenInputs['IntFilter'] | null; // IntFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    payment?: NexusGenInputs['PaymentWhereInput'] | null; // PaymentWhereInput
    paymentState?: NexusGenInputs['EnumProposalPaymentStateFilter'] | null; // EnumProposalPaymentStateFilter
    proposal?: NexusGenInputs['ProposalWhereInput'] | null; // ProposalWhereInput
    subscription?: NexusGenInputs['SubscriptionWhereInput'] | null; // SubscriptionWhereInput
    subscriptionId?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  JsonNullableFilter: { // input type
    equals?: NexusGenScalars['Json'] | null; // Json
    not?: NexusGenScalars['Json'] | null; // Json
  }
  LinkInput: { // input type
    title: string; // String!
    url: string; // String!
  }
  NestedBoolFilter: { // input type
    equals?: boolean | null; // Boolean
    not?: NexusGenInputs['NestedBoolFilter'] | null; // NestedBoolFilter
  }
  NestedDateTimeFilter: { // input type
    equals?: NexusGenScalars['DateTime'] | null; // DateTime
    gt?: NexusGenScalars['DateTime'] | null; // DateTime
    gte?: NexusGenScalars['DateTime'] | null; // DateTime
    in?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
    lt?: NexusGenScalars['DateTime'] | null; // DateTime
    lte?: NexusGenScalars['DateTime'] | null; // DateTime
    not?: NexusGenInputs['NestedDateTimeFilter'] | null; // NestedDateTimeFilter
    notIn?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
  }
  NestedEnumCardNetworkFilter: { // input type
    equals?: NexusGenEnums['CardNetwork'] | null; // CardNetwork
    in?: NexusGenEnums['CardNetwork'][] | null; // [CardNetwork!]
    not?: NexusGenInputs['NestedEnumCardNetworkFilter'] | null; // NestedEnumCardNetworkFilter
    notIn?: NexusGenEnums['CardNetwork'][] | null; // [CardNetwork!]
  }
  NestedEnumEventTypeFilter: { // input type
    equals?: NexusGenEnums['EventType'] | null; // EventType
    in?: NexusGenEnums['EventType'][] | null; // [EventType!]
    not?: NexusGenInputs['NestedEnumEventTypeFilter'] | null; // NestedEnumEventTypeFilter
    notIn?: NexusGenEnums['EventType'][] | null; // [EventType!]
  }
  NestedEnumFundingTypeFilter: { // input type
    equals?: NexusGenEnums['FundingType'] | null; // FundingType
    in?: NexusGenEnums['FundingType'][] | null; // [FundingType!]
    not?: NexusGenInputs['NestedEnumFundingTypeFilter'] | null; // NestedEnumFundingTypeFilter
    notIn?: NexusGenEnums['FundingType'][] | null; // [FundingType!]
  }
  NestedEnumProposalPaymentStateFilter: { // input type
    equals?: NexusGenEnums['ProposalPaymentState'] | null; // ProposalPaymentState
    in?: NexusGenEnums['ProposalPaymentState'][] | null; // [ProposalPaymentState!]
    not?: NexusGenInputs['NestedEnumProposalPaymentStateFilter'] | null; // NestedEnumProposalPaymentStateFilter
    notIn?: NexusGenEnums['ProposalPaymentState'][] | null; // [ProposalPaymentState!]
  }
  NestedEnumProposalStateFilter: { // input type
    equals?: NexusGenEnums['ProposalState'] | null; // ProposalState
    in?: NexusGenEnums['ProposalState'][] | null; // [ProposalState!]
    not?: NexusGenInputs['NestedEnumProposalStateFilter'] | null; // NestedEnumProposalStateFilter
    notIn?: NexusGenEnums['ProposalState'][] | null; // [ProposalState!]
  }
  NestedEnumProposalTypeFilter: { // input type
    equals?: NexusGenEnums['ProposalType'] | null; // ProposalType
    in?: NexusGenEnums['ProposalType'][] | null; // [ProposalType!]
    not?: NexusGenInputs['NestedEnumProposalTypeFilter'] | null; // NestedEnumProposalTypeFilter
    notIn?: NexusGenEnums['ProposalType'][] | null; // [ProposalType!]
  }
  NestedEnumVoteOutcomeFilter: { // input type
    equals?: NexusGenEnums['VoteOutcome'] | null; // VoteOutcome
    in?: NexusGenEnums['VoteOutcome'][] | null; // [VoteOutcome!]
    not?: NexusGenInputs['NestedEnumVoteOutcomeFilter'] | null; // NestedEnumVoteOutcomeFilter
    notIn?: NexusGenEnums['VoteOutcome'][] | null; // [VoteOutcome!]
  }
  NestedIntFilter: { // input type
    equals?: number | null; // Int
    gt?: number | null; // Int
    gte?: number | null; // Int
    in?: number[] | null; // [Int!]
    lt?: number | null; // Int
    lte?: number | null; // Int
    not?: NexusGenInputs['NestedIntFilter'] | null; // NestedIntFilter
    notIn?: number[] | null; // [Int!]
  }
  NestedStringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: NexusGenInputs['NestedStringFilter'] | null; // NestedStringFilter
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  NestedStringNullableFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: NexusGenInputs['NestedStringNullableFilter'] | null; // NestedStringNullableFilter
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  PaymentListRelationFilter: { // input type
    every?: NexusGenInputs['PaymentWhereInput'] | null; // PaymentWhereInput
    none?: NexusGenInputs['PaymentWhereInput'] | null; // PaymentWhereInput
    some?: NexusGenInputs['PaymentWhereInput'] | null; // PaymentWhereInput
  }
  PaymentWhereInput: { // input type
    AND?: NexusGenInputs['PaymentWhereInput'][] | null; // [PaymentWhereInput!]
    NOT?: NexusGenInputs['PaymentWhereInput'][] | null; // [PaymentWhereInput!]
    OR?: NexusGenInputs['PaymentWhereInput'][] | null; // [PaymentWhereInput!]
    card?: NexusGenInputs['CardWhereInput'] | null; // CardWhereInput
    cardId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    common?: NexusGenInputs['CommonWhereInput'] | null; // CommonWhereInput
    commonId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    commonMember?: NexusGenInputs['CommonMemberWhereInput'] | null; // CommonMemberWhereInput
    commonMemberId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    proposal?: NexusGenInputs['JoinProposalWhereInput'] | null; // JoinProposalWhereInput
    proposalId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    subscription?: NexusGenInputs['SubscriptionWhereInput'] | null; // SubscriptionWhereInput
    subscriptionId?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringFilter'] | null; // StringFilter
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
  ProposalListRelationFilter: { // input type
    every?: NexusGenInputs['ProposalWhereInput'] | null; // ProposalWhereInput
    none?: NexusGenInputs['ProposalWhereInput'] | null; // ProposalWhereInput
    some?: NexusGenInputs['ProposalWhereInput'] | null; // ProposalWhereInput
  }
  ProposalWhereInput: { // input type
    AND?: NexusGenInputs['ProposalWhereInput'][] | null; // [ProposalWhereInput!]
    NOT?: NexusGenInputs['ProposalWhereInput'][] | null; // [ProposalWhereInput!]
    OR?: NexusGenInputs['ProposalWhereInput'][] | null; // [ProposalWhereInput!]
    common?: NexusGenInputs['CommonWhereInput'] | null; // CommonWhereInput
    commonId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    commonMember?: NexusGenInputs['CommonMemberWhereInput'] | null; // CommonMemberWhereInput
    commonMemberId?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    description?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    files?: NexusGenInputs['JsonNullableFilter'] | null; // JsonNullableFilter
    funding?: NexusGenInputs['FundingProposalWhereInput'] | null; // FundingProposalWhereInput
    fundingId?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    images?: NexusGenInputs['JsonNullableFilter'] | null; // JsonNullableFilter
    join?: NexusGenInputs['JoinProposalWhereInput'] | null; // JoinProposalWhereInput
    joinId?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    link?: NexusGenInputs['JsonNullableFilter'] | null; // JsonNullableFilter
    state?: NexusGenInputs['EnumProposalStateFilter'] | null; // EnumProposalStateFilter
    title?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    type?: NexusGenInputs['EnumProposalTypeFilter'] | null; // EnumProposalTypeFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    votes?: NexusGenInputs['VoteListRelationFilter'] | null; // VoteListRelationFilter
    votesAgainst?: NexusGenInputs['IntFilter'] | null; // IntFilter
    votesFor?: NexusGenInputs['IntFilter'] | null; // IntFilter
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
    mode?: NexusGenEnums['QueryMode'] | null; // QueryMode
    not?: NexusGenInputs['NestedStringFilter'] | null; // NestedStringFilter
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  StringNullableFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    mode?: NexusGenEnums['QueryMode'] | null; // QueryMode
    not?: NexusGenInputs['NestedStringNullableFilter'] | null; // NestedStringNullableFilter
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  SubscriptionListRelationFilter: { // input type
    every?: NexusGenInputs['SubscriptionWhereInput'] | null; // SubscriptionWhereInput
    none?: NexusGenInputs['SubscriptionWhereInput'] | null; // SubscriptionWhereInput
    some?: NexusGenInputs['SubscriptionWhereInput'] | null; // SubscriptionWhereInput
  }
  SubscriptionWhereInput: { // input type
    AND?: NexusGenInputs['SubscriptionWhereInput'][] | null; // [SubscriptionWhereInput!]
    NOT?: NexusGenInputs['SubscriptionWhereInput'][] | null; // [SubscriptionWhereInput!]
    OR?: NexusGenInputs['SubscriptionWhereInput'][] | null; // [SubscriptionWhereInput!]
    card?: NexusGenInputs['CardWhereInput'] | null; // CardWhereInput
    cardId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    common?: NexusGenInputs['CommonWhereInput'] | null; // CommonWhereInput
    commonId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    commonMember?: NexusGenInputs['CommonMemberWhereInput'] | null; // CommonMemberWhereInput
    commonMemberId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    payments?: NexusGenInputs['PaymentListRelationFilter'] | null; // PaymentListRelationFilter
    proposal?: NexusGenInputs['JoinProposalListRelationFilter'] | null; // JoinProposalListRelationFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  UserWhereInput: { // input type
    AND?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    NOT?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    OR?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    cards?: NexusGenInputs['CardListRelationFilter'] | null; // CardListRelationFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    email?: NexusGenInputs['StringFilter'] | null; // StringFilter
    emailVerified?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    events?: NexusGenInputs['EventListRelationFilter'] | null; // EventListRelationFilter
    firstName?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    lastName?: NexusGenInputs['StringFilter'] | null; // StringFilter
    memberships?: NexusGenInputs['CommonMemberListRelationFilter'] | null; // CommonMemberListRelationFilter
    payments?: NexusGenInputs['PaymentListRelationFilter'] | null; // PaymentListRelationFilter
    proposals?: NexusGenInputs['ProposalListRelationFilter'] | null; // ProposalListRelationFilter
    subscriptions?: NexusGenInputs['SubscriptionListRelationFilter'] | null; // SubscriptionListRelationFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  VoteListRelationFilter: { // input type
    every?: NexusGenInputs['VoteWhereInput'] | null; // VoteWhereInput
    none?: NexusGenInputs['VoteWhereInput'] | null; // VoteWhereInput
    some?: NexusGenInputs['VoteWhereInput'] | null; // VoteWhereInput
  }
  VoteWhereInput: { // input type
    AND?: NexusGenInputs['VoteWhereInput'][] | null; // [VoteWhereInput!]
    NOT?: NexusGenInputs['VoteWhereInput'][] | null; // [VoteWhereInput!]
    OR?: NexusGenInputs['VoteWhereInput'][] | null; // [VoteWhereInput!]
    commonMember?: NexusGenInputs['CommonMemberWhereInput'] | null; // CommonMemberWhereInput
    commonMemberId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    outcome?: NexusGenInputs['EnumVoteOutcomeFilter'] | null; // EnumVoteOutcomeFilter
    proposal?: NexusGenInputs['ProposalWhereInput'] | null; // ProposalWhereInput
    proposalId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
}

export interface NexusGenEnums {
  CardNetwork: "MASTERCARD" | "VISA"
  CommonMemberRole: "Founder"
  EventType: "CardCreated" | "CardCvvVerificationFailed" | "CardCvvVerificationPassed" | "CommonCreated" | "CommonMemberCreated" | "CommonMemberRoleAdded" | "CommonMemberRoleRemoved" | "FundingRequestCreated" | "JoinRequestCreated" | "UserCreated" | "VoteCreated"
  FundingType: "Monthly" | "OneTime"
  ProposalPaymentState: "NotAttempted" | "Pending" | "Successful" | "Unsuccessful"
  ProposalState: "Accepted" | "Countdown" | "Finalizing" | "Rejected"
  ProposalType: "FundingRequest" | "JoinRequest"
  QueryMode: "default" | "insensitive"
  VoteOutcome: "Approve" | "Condemn"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Date: any
  DateTime: any
  Json: any
}

export interface NexusGenObjects {
  Card: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  Common: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    name: string; // String!
    updatedAt: NexusGenScalars['Date']; // Date!
    whitelisted: boolean; // Boolean!
  }
  FundingProposal: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  JoinProposal: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  Link: { // root type
    title: string; // String!
    url: string; // String!
  }
  Mutation: {};
  Query: {};
  User: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  Vote: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Card: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  Common: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    name: string; // String!
    updatedAt: NexusGenScalars['Date']; // Date!
    whitelisted: boolean; // Boolean!
  }
  FundingProposal: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  JoinProposal: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  Link: { // field return type
    title: string; // String!
    url: string; // String!
  }
  Mutation: { // field return type
    createCard: NexusGenRootTypes['Card']; // Card!
    createCommon: NexusGenRootTypes['Common']; // Common!
    createFundingProposal: NexusGenRootTypes['FundingProposal']; // FundingProposal!
    createJoinProposal: NexusGenRootTypes['JoinProposal']; // JoinProposal!
    createUser: NexusGenRootTypes['User']; // User!
    createVote: NexusGenRootTypes['Vote']; // Vote!
  }
  Query: { // field return type
    common: NexusGenRootTypes['Common'] | null; // Common
    commons: NexusGenRootTypes['Common'][]; // [Common!]!
    generateUserAuthToken: string; // String!
  }
  User: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    displayName: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  Vote: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
}

export interface NexusGenFieldTypeNames {
  Card: { // field return type name
    createdAt: 'Date'
    id: 'ID'
    updatedAt: 'Date'
  }
  Common: { // field return type name
    createdAt: 'Date'
    id: 'ID'
    name: 'String'
    updatedAt: 'Date'
    whitelisted: 'Boolean'
  }
  FundingProposal: { // field return type name
    createdAt: 'Date'
    id: 'ID'
    updatedAt: 'Date'
  }
  JoinProposal: { // field return type name
    createdAt: 'Date'
    id: 'ID'
    updatedAt: 'Date'
  }
  Link: { // field return type name
    title: 'String'
    url: 'String'
  }
  Mutation: { // field return type name
    createCard: 'Card'
    createCommon: 'Common'
    createFundingProposal: 'FundingProposal'
    createJoinProposal: 'JoinProposal'
    createUser: 'User'
    createVote: 'Vote'
  }
  Query: { // field return type name
    common: 'Common'
    commons: 'Common'
    generateUserAuthToken: 'String'
  }
  User: { // field return type name
    createdAt: 'Date'
    displayName: 'String'
    firstName: 'String'
    id: 'ID'
    lastName: 'String'
    updatedAt: 'Date'
  }
  Vote: { // field return type name
    createdAt: 'Date'
    id: 'ID'
    updatedAt: 'Date'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createCard: { // args
      input: NexusGenInputs['CreateCardInput']; // CreateCardInput!
    }
    createCommon: { // args
      input: NexusGenInputs['CreateCommonInput']; // CreateCommonInput!
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
    createVote: { // args
      input: NexusGenInputs['CreateVoteInput']; // CreateVoteInput!
    }
  }
  Query: {
    common: { // args
      where: NexusGenInputs['CommonWhereUniqueInput']; // CommonWhereUniqueInput!
    }
    commons: { // args
      after?: NexusGenInputs['CommonWhereUniqueInput'] | null; // CommonWhereUniqueInput
      before?: NexusGenInputs['CommonWhereUniqueInput'] | null; // CommonWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      where?: NexusGenInputs['CommonWhereInput'] | null; // CommonWhereInput
    }
    generateUserAuthToken: { // args
      authId: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

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
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}