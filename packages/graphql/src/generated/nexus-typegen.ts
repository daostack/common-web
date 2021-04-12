/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { IRequestContext } from "./../context"
import { QueryComplexity } from "nexus/dist/plugins/queryComplexityPlugin"
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
  EventOrderByInput: { // input type
    createdAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
    type?: NexusGenEnums['SortOrder'] | null; // SortOrder
    updatedAt?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  LinkInput: { // input type
    title: string; // String!
    url: string; // String!
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
  CommonMemberRole: "Founder"
  EventType: "CardCreated" | "CardCvvVerificationFailed" | "CardCvvVerificationPassed" | "CommonCreated" | "CommonMemberCreated" | "CommonMemberRoleAdded" | "CommonMemberRoleRemoved" | "DiscussionCreated" | "DiscussionMessageCreated" | "DiscussionSubscriptionCreated" | "FundingRequestAccepted" | "FundingRequestCreated" | "FundingRequestRejected" | "JoinRequestAccepted" | "JoinRequestCreated" | "JoinRequestRejected" | "PaymentCreated" | "PaymentFailed" | "PaymentSucceeded" | "ProposalExpired" | "ProposalMajorityReached" | "UserCreated" | "VoteCreated"
  FundingType: "Monthly" | "OneTime"
  ProposalType: "FundingRequest" | "JoinRequest"
  SortOrder: "asc" | "desc"
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
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
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
  Proposal: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    type: NexusGenEnums['ProposalType']; // ProposalType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Query: {};
  User: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Vote: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
}

export interface NexusGenInterfaces {
  BaseEntity: NexusGenRootTypes['Discussion'];
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
    events: NexusGenRootTypes['Event'][]; // [Event!]!
    id: string; // ID!
    members: Array<NexusGenRootTypes['CommonMember'] | null>; // [CommonMember]!
    name: string; // String!
    proposals: NexusGenRootTypes['Proposal'][]; // [Proposal!]!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    whitelisted: boolean; // Boolean!
  }
  CommonMember: { // field return type
    common: NexusGenRootTypes['Common'] | null; // Common
    commonId: string; // ID!
    id: string; // ID!
    roles: NexusGenEnums['CommonMemberRole'][]; // [CommonMemberRole!]!
    user: NexusGenRootTypes['User'] | null; // User
    userId: string; // ID!
  }
  Discussion: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
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
    createCard: NexusGenRootTypes['Card']; // Card!
    createCommon: NexusGenRootTypes['Common']; // Common!
    createDiscussion: NexusGenRootTypes['Discussion']; // Discussion!
    createFundingProposal: NexusGenRootTypes['FundingProposal']; // FundingProposal!
    createJoinProposal: NexusGenRootTypes['JoinProposal']; // JoinProposal!
    createUser: NexusGenRootTypes['User']; // User!
    createVote: NexusGenRootTypes['Vote']; // Vote!
    finalizeProposal: boolean; // Boolean!
  }
  Proposal: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    type: NexusGenEnums['ProposalType']; // ProposalType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Query: { // field return type
    common: NexusGenRootTypes['Common'] | null; // Common
    generateUserAuthToken: string; // String!
    user: NexusGenRootTypes['User'] | null; // User
  }
  User: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    displayName: string; // String!
    events: NexusGenRootTypes['Event'][]; // [Event!]!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    proposals: NexusGenRootTypes['Proposal'][]; // [Proposal!]!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Vote: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  BaseEntity: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
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
    events: 'Event'
    id: 'ID'
    members: 'CommonMember'
    name: 'String'
    proposals: 'Proposal'
    updatedAt: 'DateTime'
    whitelisted: 'Boolean'
  }
  CommonMember: { // field return type name
    common: 'Common'
    commonId: 'ID'
    id: 'ID'
    roles: 'CommonMemberRole'
    user: 'User'
    userId: 'ID'
  }
  Discussion: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    updatedAt: 'DateTime'
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
    createCard: 'Card'
    createCommon: 'Common'
    createDiscussion: 'Discussion'
    createFundingProposal: 'FundingProposal'
    createJoinProposal: 'JoinProposal'
    createUser: 'User'
    createVote: 'Vote'
    finalizeProposal: 'Boolean'
  }
  Proposal: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    type: 'ProposalType'
    updatedAt: 'DateTime'
  }
  Query: { // field return type name
    common: 'Common'
    generateUserAuthToken: 'String'
    user: 'User'
  }
  User: { // field return type name
    createdAt: 'DateTime'
    displayName: 'String'
    events: 'Event'
    firstName: 'String'
    id: 'ID'
    lastName: 'String'
    proposals: 'Proposal'
    updatedAt: 'DateTime'
  }
  Vote: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    updatedAt: 'DateTime'
  }
  BaseEntity: { // field return type name
    createdAt: 'DateTime'
    id: 'ID'
    updatedAt: 'DateTime'
  }
}

export interface NexusGenArgTypes {
  Common: {
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
  }
  Mutation: {
    createCard: { // args
      input: NexusGenInputs['CreateCardInput']; // CreateCardInput!
    }
    createCommon: { // args
      input: NexusGenInputs['CreateCommonInput']; // CreateCommonInput!
    }
    createDiscussion: { // args
      input: NexusGenInputs['CreateDiscussionInput']; // CreateDiscussionInput!
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
    finalizeProposal: { // args
      proposalId: string; // ID!
    }
  }
  Query: {
    common: { // args
      where: NexusGenInputs['CommonWhereUniqueInput']; // CommonWhereUniqueInput!
    }
    generateUserAuthToken: { // args
      authId: string; // String!
    }
    user: { // args
      userId?: string | null; // ID
    }
  }
  User: {
    events: { // args
      orderBy?: NexusGenInputs['EventOrderByInput'] | null; // EventOrderByInput
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
  BaseEntity: "Discussion"
}

export interface NexusGenTypeInterfaces {
  Discussion: "BaseEntity"
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
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}