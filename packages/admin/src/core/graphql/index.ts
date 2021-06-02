import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';

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
  DateTime: any;
  JSON: any;
  URL: any;
  UUID: any;
  Void: any;
};

export type ActOnReportInput = {
  reportId: Scalars['UUID'];
  action: ReportAction;
};

export type Address = {
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  postalCode: Scalars['String'];
  district?: Maybe<Scalars['String']>;
};

export type BaseEntity = {
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type BillingDetailsInput = {
  name: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  line1: Scalars['String'];
  postalCode: Scalars['String'];
  line2?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
};

export type Card = {
  __typename?: 'Card';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Common = {
  __typename?: 'Common';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  whitelisted: Scalars['Boolean'];
  balance: Scalars['Int'];
  raised: Scalars['Int'];
  links?: Maybe<Scalars['JSON']>;
  rules?: Maybe<Scalars['JSON']>;
  image: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  action?: Maybe<Scalars['String']>;
  byline?: Maybe<Scalars['String']>;
  fundingType: FundingType;
  fundingMinimumAmount: Scalars['Int'];
  events: Array<Event>;
  reports: Array<Report>;
  updates: Array<CommonUpdate>;
  proposals: Array<Proposal>;
  discussions: Array<Discussion>;
  members: Array<Maybe<CommonMember>>;
  activeProposals: Scalars['Int'];
  activeFundingProposals: Scalars['Int'];
  activeJoinProposals: Scalars['Int'];
};


export type CommonEventsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EventOrderByInput>;
};


export type CommonReportsArgs = {
  where?: Maybe<ReportWhereInput>;
};


export type CommonProposalsArgs = {
  paginate?: Maybe<PaginateInput>;
  where?: Maybe<ProposalWhereInput>;
};


export type CommonDiscussionsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type CommonMembersArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CommonMemberOrderByInput>;
};

export type CommonLinkInput = {
  title: Scalars['String'];
  url: Scalars['String'];
};

export type CommonMember = BaseEntity & {
  __typename?: 'CommonMember';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['ID'];
  commonId: Scalars['ID'];
  roles: Array<CommonMemberRole>;
  user?: Maybe<User>;
  common?: Maybe<Common>;
  proposals: Array<Proposal>;
};


export type CommonMemberProposalsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<ProposalWhereInput>;
};

export type CommonMemberOrderByInput = {
  createdAt: SortOrder;
};

export enum CommonMemberRole {
  Founder = 'Founder',
  Moderator = 'Moderator'
}

export type CommonRuleInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type CommonSubscription = BaseEntity & {
  __typename?: 'CommonSubscription';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  paymentStatus: SubscriptionPaymentStatus;
  status: SubscriptionStatus;
  dueDate: Scalars['DateTime'];
  chargedAt: Scalars['DateTime'];
  voided: Scalars['Boolean'];
  amount: Scalars['Int'];
  common: Common;
};

export type CommonUpdate = BaseEntity & {
  __typename?: 'CommonUpdate';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  commonBefore: Common;
  commonAfter: Common;
  change?: Maybe<Scalars['JSON']>;
};

export type CommonWhereInput = {
  name?: Maybe<StringFilter>;
  id?: Maybe<StringFilter>;
};

export type CommonWhereUniqueInput = {
  id: Scalars['ID'];
};

export enum Country {
  Unknown = 'Unknown',
  Af = 'AF',
  Ax = 'AX',
  Al = 'AL',
  Dz = 'DZ',
  As = 'AS',
  Ad = 'AD',
  Ao = 'AO',
  Ai = 'AI',
  Aq = 'AQ',
  Ag = 'AG',
  Ar = 'AR',
  Am = 'AM',
  Aw = 'AW',
  Au = 'AU',
  At = 'AT',
  Az = 'AZ',
  Bs = 'BS',
  Bh = 'BH',
  Bd = 'BD',
  Bb = 'BB',
  By = 'BY',
  Be = 'BE',
  Bz = 'BZ',
  Bj = 'BJ',
  Bm = 'BM',
  Bt = 'BT',
  Bo = 'BO',
  Bq = 'BQ',
  Ba = 'BA',
  Bw = 'BW',
  Bv = 'BV',
  Br = 'BR',
  Io = 'IO',
  Bn = 'BN',
  Bg = 'BG',
  Bf = 'BF',
  Bi = 'BI',
  Kh = 'KH',
  Cm = 'CM',
  Ca = 'CA',
  Cv = 'CV',
  Ky = 'KY',
  Cf = 'CF',
  Td = 'TD',
  Cl = 'CL',
  Cn = 'CN',
  Cx = 'CX',
  Cc = 'CC',
  Co = 'CO',
  Km = 'KM',
  Cg = 'CG',
  Cd = 'CD',
  Ck = 'CK',
  Cr = 'CR',
  Ci = 'CI',
  Hr = 'HR',
  Cu = 'CU',
  Cw = 'CW',
  Cy = 'CY',
  Cz = 'CZ',
  Dk = 'DK',
  Dj = 'DJ',
  Dm = 'DM',
  Do = 'DO',
  Ec = 'EC',
  Eg = 'EG',
  Sv = 'SV',
  Gq = 'GQ',
  Er = 'ER',
  Ee = 'EE',
  Et = 'ET',
  Fk = 'FK',
  Fo = 'FO',
  Fj = 'FJ',
  Fi = 'FI',
  Fr = 'FR',
  Gf = 'GF',
  Pf = 'PF',
  Tf = 'TF',
  Ga = 'GA',
  Gm = 'GM',
  Ge = 'GE',
  De = 'DE',
  Gh = 'GH',
  Gi = 'GI',
  Gr = 'GR',
  Gl = 'GL',
  Gd = 'GD',
  Gp = 'GP',
  Gu = 'GU',
  Gt = 'GT',
  Gg = 'GG',
  Gn = 'GN',
  Gw = 'GW',
  Gy = 'GY',
  Ht = 'HT',
  Hm = 'HM',
  Va = 'VA',
  Hn = 'HN',
  Hk = 'HK',
  Hu = 'HU',
  Is = 'IS',
  In = 'IN',
  Id = 'ID',
  Ir = 'IR',
  Iq = 'IQ',
  Ie = 'IE',
  Im = 'IM',
  Il = 'IL',
  It = 'IT',
  Jm = 'JM',
  Jp = 'JP',
  Je = 'JE',
  Jo = 'JO',
  Kz = 'KZ',
  Ke = 'KE',
  Ki = 'KI',
  Kp = 'KP',
  Kr = 'KR',
  Kw = 'KW',
  Kg = 'KG',
  La = 'LA',
  Lv = 'LV',
  Lb = 'LB',
  Ls = 'LS',
  Lr = 'LR',
  Ly = 'LY',
  Li = 'LI',
  Lt = 'LT',
  Lu = 'LU',
  Mo = 'MO',
  Mk = 'MK',
  Mg = 'MG',
  Mw = 'MW',
  My = 'MY',
  Mv = 'MV',
  Ml = 'ML',
  Mt = 'MT',
  Mh = 'MH',
  Mq = 'MQ',
  Mr = 'MR',
  Mu = 'MU',
  Yt = 'YT',
  Mx = 'MX',
  Fm = 'FM',
  Md = 'MD',
  Mc = 'MC',
  Mn = 'MN',
  Me = 'ME',
  Ms = 'MS',
  Ma = 'MA',
  Mz = 'MZ',
  Mm = 'MM',
  Na = 'NA',
  Nr = 'NR',
  Np = 'NP',
  Nl = 'NL',
  Nc = 'NC',
  Nz = 'NZ',
  Ni = 'NI',
  Ne = 'NE',
  Ng = 'NG',
  Nu = 'NU',
  Nf = 'NF',
  Mp = 'MP',
  No = 'NO',
  Om = 'OM',
  Pk = 'PK',
  Pw = 'PW',
  Ps = 'PS',
  Pa = 'PA',
  Pg = 'PG',
  Py = 'PY',
  Pe = 'PE',
  Ph = 'PH',
  Pn = 'PN',
  Pl = 'PL',
  Pt = 'PT',
  Pr = 'PR',
  Qa = 'QA',
  Re = 'RE',
  Ro = 'RO',
  Ru = 'RU',
  Rw = 'RW',
  Bl = 'BL',
  Sh = 'SH',
  Kn = 'KN',
  Lc = 'LC',
  Mf = 'MF',
  Pm = 'PM',
  Vc = 'VC',
  Ws = 'WS',
  Sm = 'SM',
  St = 'ST',
  Sa = 'SA',
  Sn = 'SN',
  Rs = 'RS',
  Sc = 'SC',
  Sl = 'SL',
  Sg = 'SG',
  Sx = 'SX',
  Sk = 'SK',
  Si = 'SI',
  Sb = 'SB',
  So = 'SO',
  Za = 'ZA',
  Gs = 'GS',
  Ss = 'SS',
  Es = 'ES',
  Lk = 'LK',
  Sd = 'SD',
  Sr = 'SR',
  Sj = 'SJ',
  Sz = 'SZ',
  Se = 'SE',
  Ch = 'CH',
  Sy = 'SY',
  Tw = 'TW',
  Tj = 'TJ',
  Tz = 'TZ',
  Th = 'TH',
  Tl = 'TL',
  Tg = 'TG',
  Tk = 'TK',
  To = 'TO',
  Tt = 'TT',
  Tn = 'TN',
  Tr = 'TR',
  Tm = 'TM',
  Tc = 'TC',
  Tv = 'TV',
  Ug = 'UG',
  Ua = 'UA',
  Ae = 'AE',
  Gb = 'GB',
  Us = 'US',
  Um = 'UM',
  Uy = 'UY',
  Uz = 'UZ',
  Vu = 'VU',
  Ve = 'VE',
  Vn = 'VN',
  Vg = 'VG',
  Vi = 'VI',
  Wf = 'WF',
  Eh = 'EH',
  Ye = 'YE',
  Zm = 'ZM',
  Zw = 'ZW'
}

export type CreateCardInput = {
  keyId: Scalars['String'];
  encryptedData: Scalars['String'];
  expYear: Scalars['Int'];
  expMonth: Scalars['Int'];
  billingDetails: BillingDetailsInput;
};

export type CreateCommonInput = {
  name: Scalars['String'];
  fundingMinimumAmount: Scalars['Int'];
  fundingType: FundingType;
  action?: Maybe<Scalars['String']>;
  byline?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  links?: Maybe<Array<CommonLinkInput>>;
  rules?: Maybe<Array<CommonRuleInput>>;
};

export type CreateDiscussionInput = {
  topic: Scalars['String'];
  description: Scalars['String'];
  commonId: Scalars['ID'];
  proposalId?: Maybe<Scalars['ID']>;
};

export type CreateDiscussionMessageInput = {
  discussionId: Scalars['ID'];
  message: Scalars['String'];
};

export type CreateFundingProposalInput = {
  commonId: Scalars['ID'];
  amount: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  links?: Maybe<Array<ProposalLinkInput>>;
  files?: Maybe<Array<ProposalFileInput>>;
  images?: Maybe<Array<ProposalImageInput>>;
};

export type CreateJoinProposalInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  fundingAmount: Scalars['Int'];
  cardId: Scalars['String'];
  commonId: Scalars['String'];
  links?: Maybe<Array<LinkInput>>;
};

export type CreateNotificationEventSettingsInput = {
  sendToEveryone: Scalars['Boolean'];
  sendToCommon: Scalars['Boolean'];
  sendToUser: Scalars['Boolean'];
  description: Scalars['String'];
  sendNotificationType: NotificationType;
  onEvent: EventType;
};

export type CreateNotificationTemplateInput = {
  forType: NotificationType;
  language: NotificationLanguage;
  templateType: NotificationTemplateType;
  subject: Scalars['String'];
  content: Scalars['String'];
  fromEmail?: Maybe<Scalars['String']>;
  fromName?: Maybe<Scalars['String']>;
};

export type CreatePayoutInput = {
  wireId: Scalars['ID'];
  proposalIds: Array<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
};

export type CreateRoleInput = {
  name: Scalars['String'];
  displayName: Scalars['String'];
  description: Scalars['String'];
  permissions: Array<Scalars['String']>;
};

export type CreateUserBillingDetailsInput = {
  name: Scalars['String'];
  line2?: Maybe<Scalars['String']>;
  line1: Scalars['String'];
  district?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
  country: Country;
};

export type CreateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  photo: Scalars['String'];
  country: Country;
  intro?: Maybe<Scalars['String']>;
};

export type CreateUserNotificationTokenInput = {
  token: Scalars['String'];
  description: Scalars['String'];
};

export type CreateVoteInput = {
  outcome: VoteOutcome;
  proposalId: Scalars['ID'];
};

export type CreateWireBankAccountInput = {
  bankName: Scalars['String'];
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
  country: Country;
};

export type CreateWireInput = {
  iban?: Maybe<Scalars['String']>;
  accountNumber?: Maybe<Scalars['String']>;
  routingNumber?: Maybe<Scalars['String']>;
  userId: Scalars['String'];
  billingDetailsId?: Maybe<Scalars['String']>;
  createBillingDetails?: Maybe<CreateUserBillingDetailsInput>;
  wireBankDetailsId?: Maybe<Scalars['String']>;
  createWireBankDetails?: Maybe<CreateWireBankAccountInput>;
};


export type Discussion = BaseEntity & {
  __typename?: 'Discussion';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  topic: Scalars['String'];
  description: Scalars['String'];
  latestMessage: Scalars['DateTime'];
  type: DiscussionType;
  userId: Scalars['String'];
  owner?: Maybe<User>;
  messages: Array<DiscussionMessage>;
};


export type DiscussionMessagesArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DiscussionMessagesOrderByInput>;
};

export type DiscussionMessage = BaseEntity & {
  __typename?: 'DiscussionMessage';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  message: Scalars['String'];
  type: DiscussionMessageType;
  flag: DiscussionMessageFlag;
  userId: Scalars['String'];
  reports: Array<Report>;
  owner: User;
};

export enum DiscussionMessageFlag {
  Clear = 'Clear',
  Reported = 'Reported',
  Hidden = 'Hidden'
}

export type DiscussionMessagesOrderByInput = {
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
};

export enum DiscussionMessageType {
  Message = 'Message'
}

export type DiscussionSubscription = BaseEntity & {
  __typename?: 'DiscussionSubscription';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  type: DiscussionSubscriptionType;
  userId: Scalars['String'];
  discussionId: Scalars['UUID'];
  discussion: Discussion;
};

export type DiscussionSubscriptionOrderByInput = {
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
};

export enum DiscussionSubscriptionType {
  AllNotifications = 'AllNotifications',
  OnlyMentions = 'OnlyMentions',
  NoNotification = 'NoNotification'
}

export enum DiscussionType {
  ProposalDiscussion = 'ProposalDiscussion',
  CommonDiscussion = 'CommonDiscussion'
}

export type DiscussionWhereInput = {
  commonId?: Maybe<Scalars['UUID']>;
  commonMemberId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['ID']>;
};

export type Event = {
  __typename?: 'Event';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  type: EventType;
  payload?: Maybe<Scalars['JSON']>;
  commonId?: Maybe<Scalars['ID']>;
  userId?: Maybe<Scalars['ID']>;
  user?: Maybe<User>;
};

export type EventOrderByInput = {
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  type?: Maybe<SortOrder>;
};

export enum EventType {
  CommonCreated = 'CommonCreated',
  CommonUpdated = 'CommonUpdated',
  CommonDelisted = 'CommonDelisted',
  CommonWhitelisted = 'CommonWhitelisted',
  CommonMemberCreated = 'CommonMemberCreated',
  CommonMemberRoleAdded = 'CommonMemberRoleAdded',
  CommonMemberRoleRemoved = 'CommonMemberRoleRemoved',
  JoinRequestCreated = 'JoinRequestCreated',
  JoinRequestAccepted = 'JoinRequestAccepted',
  JoinRequestRejected = 'JoinRequestRejected',
  FundingRequestCreated = 'FundingRequestCreated',
  FundingRequestAccepted = 'FundingRequestAccepted',
  FundingRequestRejected = 'FundingRequestRejected',
  CardCreated = 'CardCreated',
  CardCvvVerificationPassed = 'CardCvvVerificationPassed',
  CardCvvVerificationFailed = 'CardCvvVerificationFailed',
  PaymentCreated = 'PaymentCreated',
  PaymentSucceeded = 'PaymentSucceeded',
  PaymentFailed = 'PaymentFailed',
  ProposalMajorityReached = 'ProposalMajorityReached',
  ProposalExpired = 'ProposalExpired',
  VoteCreated = 'VoteCreated',
  UserCreated = 'UserCreated',
  UserUpdated = 'UserUpdated',
  DiscussionCreated = 'DiscussionCreated',
  DiscussionMessageCreated = 'DiscussionMessageCreated',
  DiscussionSubscriptionCreated = 'DiscussionSubscriptionCreated',
  DiscussionSubscriptionTypeChanged = 'DiscussionSubscriptionTypeChanged',
  NotificationTemplateCreated = 'NotificationTemplateCreated',
  NotificationTemplateUpdated = 'NotificationTemplateUpdated',
  UserNotificationTokenVoided = 'UserNotificationTokenVoided',
  UserNotificationTokenExpired = 'UserNotificationTokenExpired',
  UserNotificationTokenCreated = 'UserNotificationTokenCreated',
  UserNotificationTokenRefreshed = 'UserNotificationTokenRefreshed',
  ReportCreated = 'ReportCreated',
  ReportRespected = 'ReportRespected',
  ReportDismissed = 'ReportDismissed',
  RoleCreated = 'RoleCreated',
  RoleUpdated = 'RoleUpdated',
  RolePermissionAdded = 'RolePermissionAdded',
  RolePermissionRemoved = 'RolePermissionRemoved',
  RoleDeleted = 'RoleDeleted',
  UserAddedToRole = 'UserAddedToRole',
  UserRemovedFromRole = 'UserRemovedFromRole',
  WireCreated = 'WireCreated',
  WireUpdated = 'WireUpdated',
  PayoutCreated = 'PayoutCreated',
  PayoutApprovalGiven = 'PayoutApprovalGiven',
  PayoutRejectionGiven = 'PayoutRejectionGiven',
  PayoutApproved = 'PayoutApproved',
  PayoutRejected = 'PayoutRejected',
  PayoutExecuted = 'PayoutExecuted',
  PayoutCompleted = 'PayoutCompleted'
}

export type FundingProposal = BaseEntity & {
  __typename?: 'FundingProposal';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  amount: Scalars['Int'];
  fundingState: FundingState;
};

export type FundingProposalWhereInput = {
  fundingState?: Maybe<FundingState>;
};

export enum FundingState {
  NotEligible = 'NotEligible',
  Eligible = 'Eligible',
  Redeemed = 'Redeemed'
}

export enum FundingType {
  OneTime = 'OneTime',
  Monthly = 'Monthly'
}

export type JoinProposal = BaseEntity & {
  __typename?: 'JoinProposal';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  funding: Scalars['Int'];
  fundingType: FundingType;
  paymentState: PaymentState;
};


export type Link = {
  __typename?: 'Link';
  title: Scalars['String'];
  url: Scalars['String'];
};

export type LinkInput = {
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  createUserBillingDetails?: Maybe<UserBillingDetails>;
  voidUserNotificationToken: UserNotificationToken;
  createUserNotificationToken: UserNotificationToken;
  updateUser?: Maybe<User>;
  createWire?: Maybe<Wire>;
  createWireBankAccount?: Maybe<WireBankAccount>;
  createRole?: Maybe<Role>;
  assignRole?: Maybe<Scalars['Void']>;
  unassignRole?: Maybe<Scalars['Void']>;
  createCard: Card;
  createVote: Vote;
  createCommon: Common;
  updateCommon?: Maybe<Common>;
  delistCommon?: Maybe<Scalars['Boolean']>;
  whitelistCommon?: Maybe<Scalars['Boolean']>;
  actOnReport?: Maybe<Report>;
  reportDiscussionMessage: Report;
  createPayout?: Maybe<Payout>;
  approvePayout?: Maybe<PayoutApprover>;
  finalizeProposal: Scalars['Boolean'];
  createJoinProposal: Proposal;
  createFundingProposal: Proposal;
  createDiscussion: Discussion;
  createDiscussionMessage: DiscussionMessage;
  changeDiscussionSubscriptionType?: Maybe<DiscussionSubscription>;
  updateNotificationTemplate?: Maybe<NotificationTemplate>;
  createNotificationEventSettings?: Maybe<NotificationEventSettings>;
  updateNotificationSettings?: Maybe<NotificationSystemSettings>;
  createNotificationTemplate?: Maybe<NotificationTemplate>;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateUserBillingDetailsArgs = {
  input: CreateUserBillingDetailsInput;
};


export type MutationVoidUserNotificationTokenArgs = {
  tokenId: Scalars['ID'];
};


export type MutationCreateUserNotificationTokenArgs = {
  input: CreateUserNotificationTokenInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationCreateWireArgs = {
  input: CreateWireInput;
};


export type MutationCreateWireBankAccountArgs = {
  input: CreateWireBankAccountInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationAssignRoleArgs = {
  userId: Scalars['ID'];
  roleId: Scalars['ID'];
};


export type MutationUnassignRoleArgs = {
  userId: Scalars['ID'];
  roleId: Scalars['ID'];
};


export type MutationCreateCardArgs = {
  input: CreateCardInput;
};


export type MutationCreateVoteArgs = {
  input: CreateVoteInput;
};


export type MutationCreateCommonArgs = {
  input: CreateCommonInput;
};


export type MutationUpdateCommonArgs = {
  input: UpdateCommonInput;
};


export type MutationDelistCommonArgs = {
  commonId: Scalars['String'];
};


export type MutationWhitelistCommonArgs = {
  commonId: Scalars['String'];
};


export type MutationActOnReportArgs = {
  input: ActOnReportInput;
};


export type MutationReportDiscussionMessageArgs = {
  input: ReportDiscussionMessageInput;
};


export type MutationCreatePayoutArgs = {
  input: CreatePayoutInput;
};


export type MutationApprovePayoutArgs = {
  payoutId: Scalars['ID'];
  outcome: PayoutApproverResponse;
};


export type MutationFinalizeProposalArgs = {
  proposalId: Scalars['ID'];
};


export type MutationCreateJoinProposalArgs = {
  input: CreateJoinProposalInput;
};


export type MutationCreateFundingProposalArgs = {
  input: CreateFundingProposalInput;
};


export type MutationCreateDiscussionArgs = {
  input: CreateDiscussionInput;
};


export type MutationCreateDiscussionMessageArgs = {
  input: CreateDiscussionMessageInput;
};


export type MutationChangeDiscussionSubscriptionTypeArgs = {
  id: Scalars['ID'];
  type: DiscussionSubscriptionType;
};


export type MutationUpdateNotificationTemplateArgs = {
  input: UpdateNotificationTemplateInput;
};


export type MutationCreateNotificationEventSettingsArgs = {
  input: CreateNotificationEventSettingsInput;
};


export type MutationUpdateNotificationSettingsArgs = {
  input: UpdateNotificationSettingsInput;
};


export type MutationCreateNotificationTemplateArgs = {
  input: CreateNotificationTemplateInput;
};

export type Notification = BaseEntity & {
  __typename?: 'Notification';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  show: Scalars['Boolean'];
  type: NotificationType;
  seenStatus: NotificationSeenStatus;
  userId: Scalars['UUID'];
  user: User;
  commonId?: Maybe<Scalars['UUID']>;
  common?: Maybe<Common>;
  proposalId?: Maybe<Scalars['UUID']>;
  proposal?: Maybe<Proposal>;
  discussionId?: Maybe<Scalars['UUID']>;
  discussion?: Maybe<Discussion>;
};

export type NotificationEventOptions = {
  __typename?: 'NotificationEventOptions';
  availableNotifications: Array<NotificationType>;
  availableEvents: Array<EventType>;
};

export type NotificationEventSettings = BaseEntity & {
  __typename?: 'NotificationEventSettings';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  active: Scalars['Boolean'];
  sendToEveryone: Scalars['Boolean'];
  sendToCommon: Scalars['Boolean'];
  sendToUser: Scalars['Boolean'];
  description: Scalars['String'];
  sendNotificationType: NotificationType;
  onEvent: EventType;
};

export enum NotificationLanguage {
  En = 'EN',
  Ru = 'RU',
  Bg = 'BG',
  He = 'HE',
  Jp = 'JP',
  Ko = 'KO'
}

export type NotificationOrderByInput = {
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  status?: Maybe<SortOrder>;
};

export enum NotificationSeenStatus {
  NotSeen = 'NotSeen',
  Seen = 'Seen',
  Done = 'Done'
}

export type NotificationSettingsWhereInput = {
  type?: Maybe<NotificationType>;
};

export type NotificationSystemSettings = BaseEntity & {
  __typename?: 'NotificationSystemSettings';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  type: NotificationType;
  sendEmail: Scalars['Boolean'];
  sendPush: Scalars['Boolean'];
  showInUserFeed: Scalars['Boolean'];
};

export type NotificationTemplate = BaseEntity & {
  __typename?: 'NotificationTemplate';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  forType: NotificationType;
  templateType: NotificationTemplateType;
  language: NotificationLanguage;
  subject: Scalars['String'];
  content: Scalars['String'];
  from?: Maybe<Scalars['String']>;
  fromName?: Maybe<Scalars['String']>;
  bcc?: Maybe<Scalars['String']>;
  bccName?: Maybe<Scalars['String']>;
};

export type NotificationTemplateOptions = {
  __typename?: 'NotificationTemplateOptions';
  languages: Array<Maybe<NotificationLanguage>>;
  templateTypes: Array<Maybe<NotificationTemplateType>>;
  notificationTypes: Array<Maybe<NotificationType>>;
};

export enum NotificationTemplateType {
  PushNotification = 'PushNotification',
  EmailNotification = 'EmailNotification'
}

export type NotificationTemplateWhereInput = {
  language?: Maybe<NotificationLanguage>;
  forType?: Maybe<NotificationType>;
  type?: Maybe<NotificationTemplateType>;
};

export enum NotificationType {
  JoinRequestAccepted = 'JoinRequestAccepted',
  JoinRequestRejected = 'JoinRequestRejected',
  FundingRequestAccepted = 'FundingRequestAccepted',
  FundingRequestRejected = 'FundingRequestRejected',
  General = 'General'
}

export type NotificationWhereInput = {
  seenStatus?: Maybe<NotificationSeenStatus>;
  type?: Maybe<NotificationType>;
  userId?: Maybe<Scalars['ID']>;
  commonId?: Maybe<Scalars['UUID']>;
  proposalId?: Maybe<Scalars['UUID']>;
  discussionId?: Maybe<Scalars['UUID']>;
};

export type NotificationWhereUniqueInput = {
  id?: Maybe<Scalars['UUID']>;
};

export type PaginateInput = {
  take: Scalars['Int'];
  skip?: Maybe<Scalars['Int']>;
};

export type Payment = BaseEntity & {
  __typename?: 'Payment';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  processed: Scalars['Boolean'];
  processedError: Scalars['Boolean'];
  type: PaymentType;
  status: PaymentStatus;
  circlePaymentStatus?: Maybe<PaymentCircleStatus>;
  circlePaymentId?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Int']>;
  fees?: Maybe<Scalars['Int']>;
  userId: Scalars['String'];
  user: User;
  commonId: Scalars['String'];
  common: Common;
};

export enum PaymentCircleStatus {
  Pending = 'pending',
  Failed = 'failed',
  Confirmed = 'confirmed',
  Paid = 'paid'
}

export type PaymentsWhereInput = {
  commonId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['UUID']>;
};

export enum PaymentState {
  NotAttempted = 'NotAttempted',
  Pending = 'Pending',
  Successful = 'Successful',
  Unsuccessful = 'Unsuccessful'
}

export enum PaymentStatus {
  NotAttempted = 'NotAttempted',
  Pending = 'Pending',
  Successful = 'Successful',
  Unsuccessful = 'Unsuccessful'
}

export enum PaymentType {
  OneTimePayment = 'OneTimePayment',
  SubscriptionInitialPayment = 'SubscriptionInitialPayment',
  SubscriptionSequentialPayment = 'SubscriptionSequentialPayment',
  ImportedPayment = 'ImportedPayment'
}

export type Payout = BaseEntity & {
  __typename?: 'Payout';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  status: PayoutStatus;
  amount: Scalars['Int'];
  description: Scalars['String'];
  proposals: Array<Proposal>;
};

export type PayoutApprover = BaseEntity & {
  __typename?: 'PayoutApprover';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  outcome: PayoutApproverResponse;
  userId: Scalars['ID'];
};

export enum PayoutApproverResponse {
  Pending = 'Pending',
  Approved = 'Approved',
  Declined = 'Declined'
}

export enum PayoutStatus {
  PendingApproval = 'PendingApproval',
  CirclePending = 'CirclePending',
  CircleComplete = 'CircleComplete',
  CircleFailed = 'CircleFailed',
  Failed = 'Failed'
}

export type PayoutStatusFilter = {
  in?: Maybe<Array<Maybe<PayoutStatus>>>;
  notIn?: Maybe<Array<Maybe<PayoutStatus>>>;
  equals?: Maybe<PayoutStatus>;
  not?: Maybe<PayoutStatus>;
};

export type PayoutWhereInput = {
  status?: Maybe<PayoutStatusFilter>;
};

export type Proposal = {
  __typename?: 'Proposal';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  type: ProposalType;
  state: ProposalState;
  links?: Maybe<Scalars['JSON']>;
  files?: Maybe<Scalars['JSON']>;
  images?: Maybe<Scalars['JSON']>;
  votesFor: Scalars['Int'];
  votesAgainst: Scalars['Int'];
  expiresAt: Scalars['DateTime'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  ipAddress?: Maybe<Scalars['String']>;
  discussions: Array<Discussion>;
  userId: Scalars['ID'];
  commonMemberId: Scalars['UUID'];
  user: User;
  member: CommonMember;
  fundingId?: Maybe<Scalars['UUID']>;
  funding?: Maybe<FundingProposal>;
  commonId: Scalars['UUID'];
  common: Common;
  votes: Array<Vote>;
  joinId?: Maybe<Scalars['UUID']>;
  join?: Maybe<JoinProposal>;
};


export type ProposalDiscussionsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};

export type ProposalFileInput = {
  value: Scalars['String'];
};

export type ProposalImageInput = {
  value: Scalars['String'];
};

export type ProposalLinkInput = {
  title: Scalars['String'];
  url: Scalars['String'];
};

export enum ProposalState {
  Countdown = 'Countdown',
  Finalizing = 'Finalizing',
  Rejected = 'Rejected',
  Accepted = 'Accepted'
}

export enum ProposalType {
  FundingRequest = 'FundingRequest',
  JoinRequest = 'JoinRequest'
}

export type ProposalWhereInput = {
  id?: Maybe<StringFilter>;
  type?: Maybe<ProposalType>;
  state?: Maybe<ProposalState>;
  commonId?: Maybe<Scalars['UUID']>;
  commonMemberId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['ID']>;
  title?: Maybe<StringFilter>;
  description?: Maybe<StringFilter>;
  AND?: Maybe<Array<ProposalWhereInput>>;
  OR?: Maybe<Array<ProposalWhereInput>>;
};

export type ProposalWhereUniqueInput = {
  id: Scalars['UUID'];
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  generateUserAuthToken: Scalars['String'];
  wires?: Maybe<Array<Maybe<Wire>>>;
  role?: Maybe<Role>;
  roles?: Maybe<Array<Maybe<Role>>>;
  events?: Maybe<Array<Maybe<Event>>>;
  common?: Maybe<Common>;
  commons?: Maybe<Array<Maybe<Common>>>;
  payout?: Maybe<Payout>;
  payouts?: Maybe<Array<Maybe<Payout>>>;
  payment?: Maybe<Payment>;
  payments?: Maybe<Array<Maybe<Payment>>>;
  proposal?: Maybe<Proposal>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  settings: Settings;
  getStatistics?: Maybe<Array<Maybe<Statistic>>>;
  discussion?: Maybe<Discussion>;
  discussions?: Maybe<Array<Maybe<Discussion>>>;
  notificationTemplateOptions?: Maybe<NotificationTemplateOptions>;
  notificationEventOptions?: Maybe<NotificationEventOptions>;
  notificationEventSettings?: Maybe<Array<Maybe<NotificationEventSettings>>>;
  notificationTemplates?: Maybe<Array<Maybe<NotificationTemplate>>>;
  notificationSettings?: Maybe<Array<Maybe<NotificationSystemSettings>>>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
};


export type QueryUserArgs = {
  where?: Maybe<UserWhereUniqueInput>;
};


export type QueryUsersArgs = {
  where?: Maybe<UserWhereInput>;
  paginate?: Maybe<PaginateInput>;
};


export type QueryGenerateUserAuthTokenArgs = {
  authId: Scalars['String'];
};


export type QueryWiresArgs = {
  where?: Maybe<WireWhereInput>;
};


export type QueryRoleArgs = {
  where: RoleWhereUniqueInput;
};


export type QueryRolesArgs = {
  paginate?: Maybe<PaginateInput>;
};


export type QueryEventsArgs = {
  paginate?: Maybe<PaginateInput>;
};


export type QueryCommonArgs = {
  where: CommonWhereUniqueInput;
};


export type QueryCommonsArgs = {
  paginate?: Maybe<PaginateInput>;
  where?: Maybe<CommonWhereInput>;
};


export type QueryPayoutArgs = {
  id: Scalars['ID'];
};


export type QueryPayoutsArgs = {
  paginate?: Maybe<PaginateInput>;
  where?: Maybe<PayoutWhereInput>;
};


export type QueryPaymentArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryPaymentsArgs = {
  paginate?: Maybe<PaginateInput>;
  where?: Maybe<PaymentsWhereInput>;
};


export type QueryProposalArgs = {
  where: ProposalWhereUniqueInput;
};


export type QueryProposalsArgs = {
  where?: Maybe<ProposalWhereInput>;
  fundingWhere?: Maybe<FundingProposalWhereInput>;
  paginate?: Maybe<PaginateInput>;
};


export type QueryGetStatisticsArgs = {
  where?: Maybe<StatisticsWhereInput>;
};


export type QueryDiscussionArgs = {
  id: Scalars['ID'];
};


export type QueryDiscussionsArgs = {
  where?: Maybe<DiscussionWhereInput>;
  paginate?: Maybe<PaginateInput>;
};


export type QueryNotificationEventSettingsArgs = {
  paginate: PaginateInput;
};


export type QueryNotificationTemplatesArgs = {
  where?: Maybe<NotificationTemplateWhereInput>;
  paginate?: Maybe<PaginateInput>;
};


export type QueryNotificationSettingsArgs = {
  where?: Maybe<NotificationSettingsWhereInput>;
};


export type QueryNotificationsArgs = {
  paginate: PaginateInput;
};

export type Report = BaseEntity & {
  __typename?: 'Report';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  status: ReportStatus;
  for: ReportFor;
  note: Scalars['String'];
  reviewedOn?: Maybe<Scalars['DateTime']>;
  reporterId: Scalars['ID'];
  reporter: User;
  messageId: Scalars['UUID'];
  message: DiscussionMessage;
};

export enum ReportAction {
  Respected = 'Respected',
  Dismissed = 'Dismissed'
}

export enum ReportAuditor {
  CommonModerator = 'CommonModerator',
  SystemAdmin = 'SystemAdmin'
}

export type ReportDiscussionMessageInput = {
  messageId: Scalars['UUID'];
  note: Scalars['String'];
  for: ReportFor;
};

export enum ReportFor {
  Nudity = 'Nudity',
  Violance = 'Violance',
  Harassment = 'Harassment',
  FalseNews = 'FalseNews',
  Spam = 'Spam',
  Hate = 'Hate',
  Other = 'Other'
}

export enum ReportStatus {
  Active = 'Active',
  Clossed = 'Clossed'
}

export type ReportStatusFilterInput = {
  in?: Maybe<Array<Maybe<ReportStatus>>>;
  not?: Maybe<Array<Maybe<ReportStatus>>>;
};

export type ReportWhereInput = {
  status?: Maybe<ReportStatusFilterInput>;
  for?: Maybe<ReportFor>;
};

export type Role = BaseEntity & {
  __typename?: 'Role';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  description: Scalars['String'];
  permissions: Array<Scalars['String']>;
  users: Array<User>;
};

export type RoleWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};

export type Settings = {
  __typename?: 'Settings';
  permissions: Array<Maybe<Scalars['String']>>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type Statistic = BaseEntity & {
  __typename?: 'Statistic';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  users: Scalars['Int'];
  commons: Scalars['Int'];
  fundingProposals: Scalars['Int'];
  joinProposals: Scalars['Int'];
};

export type StatisticsWhereInput = {
  type?: Maybe<StatisticType>;
};

export enum StatisticType {
  AllTime = 'AllTime',
  Hourly = 'Hourly',
  Daily = 'Daily',
  Weekly = 'Weekly'
}

export type StringFilter = {
  contains?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  equals?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  notIn?: Maybe<Array<Scalars['String']>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onProposalChange?: Maybe<Proposal>;
  discussionMessageCreated?: Maybe<DiscussionMessage>;
  notificationCreated?: Maybe<Notification>;
};


export type SubscriptionOnProposalChangeArgs = {
  proposalId: Scalars['ID'];
};


export type SubscriptionDiscussionMessageCreatedArgs = {
  discussionId: Scalars['ID'];
};

export enum SubscriptionPaymentStatus {
  AwaitingInitialPayment = 'AwaitingInitialPayment',
  Pending = 'Pending',
  Successful = 'Successful',
  Unsuccessful = 'Unsuccessful'
}

export enum SubscriptionStatus {
  Pending = 'Pending',
  Active = 'Active',
  PaymentFailed = 'PaymentFailed',
  CanceledByUser = 'CanceledByUser',
  CanceledByPaymentFailure = 'CanceledByPaymentFailure'
}

export type UpdateCommonInput = {
  commonId: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  action?: Maybe<Scalars['String']>;
  byline?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  links?: Maybe<Array<CommonLinkInput>>;
  rules?: Maybe<Array<CommonRuleInput>>;
};

export type UpdateNotificationSettingsInput = {
  id: Scalars['String'];
  showInUserFeed?: Maybe<Scalars['Boolean']>;
  sendPush?: Maybe<Scalars['Boolean']>;
  sendEmail?: Maybe<Scalars['Boolean']>;
};

export type UpdateNotificationTemplateInput = {
  id: Scalars['String'];
  subject?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  fromEmail?: Maybe<Scalars['String']>;
  fromName?: Maybe<Scalars['String']>;
  bcc?: Maybe<Scalars['String']>;
  bccName?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  id: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  photo?: Maybe<Scalars['String']>;
  intro?: Maybe<Scalars['String']>;
  country?: Maybe<Country>;
  notificationLanguage?: Maybe<NotificationLanguage>;
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  country: Country;
  intro?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  photo: Scalars['String'];
  email: Scalars['String'];
  permissions: Array<Scalars['String']>;
  wires: Array<Wire>;
  events: Array<Event>;
  commons: Array<Common>;
  proposals: Array<Proposal>;
  subscriptions: Array<CommonSubscription>;
  notifications: Array<Notification>;
  billingDetails: Array<UserBillingDetails>;
  notificationTokens: Array<UserNotificationToken>;
  discussionSubscriptions: Array<DiscussionSubscription>;
};


export type UserEventsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EventOrderByInput>;
};


export type UserProposalsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<ProposalWhereInput>;
};


export type UserNotificationsArgs = {
  orderBy?: Maybe<NotificationOrderByInput>;
  cursor?: Maybe<NotificationWhereUniqueInput>;
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type UserDiscussionSubscriptionsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DiscussionSubscriptionOrderByInput>;
};

export type UserBillingDetails = BaseEntity & Address & {
  __typename?: 'UserBillingDetails';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  postalCode: Scalars['String'];
  district?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type UserNotificationToken = BaseEntity & {
  __typename?: 'UserNotificationToken';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  state: UserNotificationTokenState;
  token: Scalars['String'];
  description: Scalars['String'];
  lastUsed: Scalars['DateTime'];
  lastVerified: Scalars['DateTime'];
};

export enum UserNotificationTokenState {
  Active = 'Active',
  Expired = 'Expired',
  Voided = 'Voided'
}

export type UserWhereInput = {
  firstName?: Maybe<StringFilter>;
  lastName?: Maybe<StringFilter>;
  email?: Maybe<StringFilter>;
  OR?: Maybe<Array<UserWhereInput>>;
  AND?: Maybe<Array<UserWhereInput>>;
};

export type UserWhereUniqueInput = {
  userId: Scalars['ID'];
};


export type Vote = {
  __typename?: 'Vote';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  outcome: VoteOutcome;
  voterId: Scalars['ID'];
  voter: CommonMember;
};

export enum VoteOutcome {
  Approve = 'Approve',
  Condemn = 'Condemn'
}

export type Wire = BaseEntity & {
  __typename?: 'Wire';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  circleId?: Maybe<Scalars['String']>;
  circleFingerprint?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type WireBankAccount = BaseEntity & Address & {
  __typename?: 'WireBankAccount';
  id: Scalars['UUID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  postalCode: Scalars['String'];
  district?: Maybe<Scalars['String']>;
  bankName: Scalars['String'];
};

export type WireWhereInput = {
  userId?: Maybe<StringFilter>;
};

export type WhitelistCommonMutationVariables = Exact<{
  commonId: Scalars['String'];
}>;


export type WhitelistCommonMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'whitelistCommon'>
  );

export type DelistCommonMutationVariables = Exact<{
  commonId: Scalars['String'];
}>;


export type DelistCommonMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'delistCommon'>
  );

export type CommonSearchQueryVariables = Exact<{
  where?: Maybe<CommonWhereInput>;
}>;


export type CommonSearchQuery = (
  { __typename?: 'Query' }
  & {
  commons?: Maybe<Array<Maybe<(
    { __typename?: 'Common' }
    & Pick<Common, 'id' | 'name' | 'description'>
    )>>>
}
  );

export type UserSearchQueryVariables = Exact<{
  where?: Maybe<UserWhereInput>;
}>;


export type UserSearchQuery = (
  { __typename?: 'Query' }
  & {
  users?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>
    )>>>
}
  );

export type ProposalSeachQueryVariables = Exact<{
  where?: Maybe<ProposalWhereInput>;
}>;


export type ProposalSeachQuery = (
  { __typename?: 'Query' }
  & {
  proposals?: Maybe<Array<Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'title' | 'description' | 'type'>
    )>>>
}
  );

export type GetLatestEventsQueryVariables = Exact<{
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
}>;


export type GetLatestEventsQuery = (
  { __typename?: 'Query' }
  & {
  events?: Maybe<Array<Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id' | 'createdAt' | 'type'>
    & {
    user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'firstName' | 'lastName' | 'photo'>
      )>
  }
    )>>>
}
  );

export type GetPaymentsQueryVariables = Exact<{
  paginate?: Maybe<PaginateInput>;
}>;


export type GetPaymentsQuery = (
  { __typename?: 'Query' }
  & {
  payments?: Maybe<Array<Maybe<(
    { __typename?: 'Payment' }
    & Pick<Payment, 'id' | 'type' | 'status' | 'amount' | 'commonId' | 'fees'>
    & {
    user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'photo' | 'email'>
      )
  }
    )>>>
}
  );

export type LoadUserContextQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadUserContextQuery = (
  { __typename?: 'Query' }
  & {
  user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'displayName' | 'email' | 'photo' | 'permissions'>
    )>
}
  );

export type GetCommonDetailsQueryVariables = Exact<{
  commonId: Scalars['ID'];
  paginate: PaginateInput;
}>;


export type GetCommonDetailsQuery = (
  { __typename?: 'Query' }
  & {
  common?: Maybe<(
    { __typename?: 'Common' }
    & Pick<Common, 'name' | 'createdAt' | 'updatedAt' | 'balance' | 'raised' | 'fundingType' | 'activeJoinProposals' | 'activeFundingProposals' | 'byline' | 'action' | 'description' | 'image' | 'whitelisted'>
    & {
    members: Array<Maybe<(
      { __typename?: 'CommonMember' }
      & Pick<CommonMember, 'createdAt' | 'userId' | 'roles'>
      & {
      user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'firstName' | 'lastName'>
        )>
    }
      )>>, proposals: Array<(
      { __typename?: 'Proposal' }
      & Pick<Proposal, 'id' | 'type' | 'title' | 'description'>
      & {
      funding?: Maybe<(
        { __typename?: 'FundingProposal' }
        & Pick<FundingProposal, 'amount'>
        )>, join?: Maybe<(
        { __typename?: 'JoinProposal' }
        & Pick<JoinProposal, 'fundingType' | 'funding'>
        )>
    }
      )>
  }
    )>
}
  );

export type GetCommonsHomescreenDataQueryVariables = Exact<{
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
}>;


export type GetCommonsHomescreenDataQuery = (
  { __typename?: 'Query' }
  & {
  commons?: Maybe<Array<Maybe<(
    { __typename?: 'Common' }
    & Pick<Common, 'id' | 'name' | 'raised' | 'balance' | 'createdAt' | 'updatedAt' | 'description' | 'byline' | 'fundingType' | 'fundingMinimumAmount'>
    & {
    members: Array<Maybe<(
      { __typename?: 'CommonMember' }
      & Pick<CommonMember, 'userId'>
      )>>
  }
    )>>>
}
  );

export type GetAllTimeStatistiscQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTimeStatistiscQuery = (
  { __typename?: 'Query' }
  & {
  getStatistics?: Maybe<Array<Maybe<(
    { __typename?: 'Statistic' }
    & Pick<Statistic, 'users' | 'commons' | 'joinProposals' | 'fundingProposals'>
    )>>>
}
  );

export type GetProposalsSelectedForBatchQueryVariables = Exact<{
  where: ProposalWhereInput;
}>;


export type GetProposalsSelectedForBatchQuery = (
  { __typename?: 'Query' }
  & {
  proposals?: Maybe<Array<Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'state' | 'title' | 'description'>
    & {
    user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
      ), common: (
      { __typename?: 'Common' }
      & Pick<Common, 'name'>
      ), funding?: Maybe<(
      { __typename?: 'FundingProposal' }
      & Pick<FundingProposal, 'fundingState' | 'amount'>
      )>
  }
    )>>>
}
  );

export type AvailableWiresQueryVariables = Exact<{
  where: WireWhereInput;
}>;


export type AvailableWiresQuery = (
  { __typename?: 'Query' }
  & {
  wires?: Maybe<Array<Maybe<(
    { __typename?: 'Wire' }
    & Pick<Wire, 'id' | 'description'>
    )>>>
}
  );

export type CreatePayoutMutationVariables = Exact<{
  input: CreatePayoutInput;
}>;


export type CreatePayoutMutation = (
  { __typename?: 'Mutation' }
  & {
  createPayout?: Maybe<(
    { __typename?: 'Payout' }
    & Pick<Payout, 'id'>
    )>
}
  );

export type GetPayoutDetailsQueryVariables = Exact<{
  payoutId: Scalars['ID'];
}>;


export type GetPayoutDetailsQuery = (
  { __typename?: 'Query' }
  & {
  payout?: Maybe<(
    { __typename?: 'Payout' }
    & Pick<Payout, 'status'>
    & {
    proposals: Array<(
      { __typename?: 'Proposal' }
      & Pick<Proposal, 'id' | 'title' | 'description'>
      & {
      funding?: Maybe<(
        { __typename?: 'FundingProposal' }
        & Pick<FundingProposal, 'amount'>
        )>
    }
      )>
  }
    )>
}
  );

export type PayoutsPageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type PayoutsPageDataQuery = (
  { __typename?: 'Query' }
  & {
  proposals?: Maybe<Array<Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'userId' | 'commonId' | 'title' | 'description'>
    & {
    funding?: Maybe<(
      { __typename?: 'FundingProposal' }
      & Pick<FundingProposal, 'amount'>
      )>
  }
    )>>>, payouts?: Maybe<Array<Maybe<(
    { __typename?: 'Payout' }
    & Pick<Payout, 'id' | 'amount' | 'createdAt' | 'updatedAt' | 'description'>
    )>>>
}
  );

export type GetNotificationEventsQueryVariables = Exact<{
  paginate: PaginateInput;
}>;


export type GetNotificationEventsQuery = (
  { __typename?: 'Query' }
  & {
  notificationEventSettings?: Maybe<Array<Maybe<(
    { __typename?: 'NotificationEventSettings' }
    & Pick<NotificationEventSettings, 'id' | 'sendToEveryone' | 'sendToCommon' | 'sendToUser' | 'description' | 'sendNotificationType' | 'onEvent'>
    )>>>
}
  );

export type GetCreateNotificationEventOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCreateNotificationEventOptionsQuery = (
  { __typename?: 'Query' }
  & {
  notificationEventOptions?: Maybe<(
    { __typename?: 'NotificationEventOptions' }
    & Pick<NotificationEventOptions, 'availableEvents' | 'availableNotifications'>
    )>
}
  );

export type CreateNotificationEventIntegrationMutationVariables = Exact<{
  input: CreateNotificationEventSettingsInput;
}>;


export type CreateNotificationEventIntegrationMutation = (
  { __typename?: 'Mutation' }
  & {
  createNotificationEventSettings?: Maybe<(
    { __typename?: 'NotificationEventSettings' }
    & Pick<NotificationEventSettings, 'id'>
    )>
}
  );

export type GetAllUsersNotificationsQueryVariables = Exact<{
  paginate: PaginateInput;
}>;


export type GetAllUsersNotificationsQuery = (
  { __typename?: 'Query' }
  & {
  notifications?: Maybe<Array<Maybe<(
    { __typename?: 'Notification' }
    & Pick<Notification, 'id' | 'type' | 'createdAt' | 'seenStatus'>
    & {
    user: (
      { __typename?: 'User' }
      & Pick<User, 'photo' | 'displayName'>
      )
  }
    )>>>
}
  );

export type LoadNotificationSettignsQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadNotificationSettignsQuery = (
  { __typename?: 'Query' }
  & {
  notificationSettings?: Maybe<Array<Maybe<(
    { __typename?: 'NotificationSystemSettings' }
    & Pick<NotificationSystemSettings, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'sendEmail' | 'sendPush' | 'showInUserFeed'>
    )>>>
}
  );

export type UpdateNotificationSettingsMutationVariables = Exact<{
  input: UpdateNotificationSettingsInput;
}>;


export type UpdateNotificationSettingsMutation = (
  { __typename?: 'Mutation' }
  & {
  updateNotificationSettings?: Maybe<(
    { __typename?: 'NotificationSystemSettings' }
    & Pick<NotificationSystemSettings, 'id'>
    )>
}
  );

export type NotificationOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationOptionsQuery = (
  { __typename?: 'Query' }
  & {
  notificationTemplate?: Maybe<(
    { __typename?: 'NotificationTemplateOptions' }
    & Pick<NotificationTemplateOptions, 'languages' | 'templateTypes' | 'notificationTypes'>
    )>
}
  );

export type CreateNotificationTemplateMutationVariables = Exact<{
  input: CreateNotificationTemplateInput;
}>;


export type CreateNotificationTemplateMutation = (
  { __typename?: 'Mutation' }
  & {
  createNotificationTemplate?: Maybe<(
    { __typename?: 'NotificationTemplate' }
    & Pick<NotificationTemplate, 'id'>
    )>
}
  );

export type AllTemplatesForTypeQueryVariables = Exact<{
  forType: NotificationType;
}>;


export type AllTemplatesForTypeQuery = (
  { __typename?: 'Query' }
  & {
  notificationSettings?: Maybe<Array<Maybe<(
    { __typename?: 'NotificationSystemSettings' }
    & Pick<NotificationSystemSettings, 'sendEmail' | 'sendPush' | 'showInUserFeed'>
    )>>>, notificationTemplates?: Maybe<Array<Maybe<(
    { __typename?: 'NotificationTemplate' }
    & Pick<NotificationTemplate, 'id' | 'templateType' | 'language' | 'subject' | 'content' | 'from' | 'fromName'>
    )>>>
}
  );

export type UpdateTemplateMutationVariables = Exact<{
  input: UpdateNotificationTemplateInput;
}>;


export type UpdateTemplateMutation = (
  { __typename?: 'Mutation' }
  & {
  updateNotificationTemplate?: Maybe<(
    { __typename?: 'NotificationTemplate' }
    & Pick<NotificationTemplate, 'id'>
    )>
}
  );

export type GetNotificaitonTemplatesQueryVariables = Exact<{
  paginate: PaginateInput;
  where?: Maybe<NotificationTemplateWhereInput>;
}>;


export type GetNotificaitonTemplatesQuery = (
  { __typename?: 'Query' }
  & {
  notificationTemplates?: Maybe<Array<Maybe<(
    { __typename?: 'NotificationTemplate' }
    & Pick<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt' | 'subject' | 'forType' | 'language' | 'templateType'>
    )>>>
}
  );

export type GetProposalDetailsQueryVariables = Exact<{
  where: ProposalWhereUniqueInput;
}>;


export type GetProposalDetailsQuery = (
  { __typename?: 'Query' }
  & {
  proposal?: Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'type' | 'createdAt' | 'updatedAt' | 'votesFor' | 'votesAgainst' | 'state' | 'description'>
    & {
    join?: Maybe<(
      { __typename?: 'JoinProposal' }
      & Pick<JoinProposal, 'funding' | 'fundingType' | 'paymentState'>
      )>, funding?: Maybe<(
      { __typename?: 'FundingProposal' }
      & Pick<FundingProposal, 'amount' | 'fundingState'>
      )>, user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
      ), common: (
      { __typename?: 'Common' }
      & {
      members: Array<Maybe<(
        { __typename?: 'CommonMember' }
        & Pick<CommonMember, 'userId'>
        )>>
    }
      ), votes: Array<(
      { __typename?: 'Vote' }
      & Pick<Vote, 'id' | 'outcome'>
      & {
      voter: (
        { __typename?: 'CommonMember' }
        & {
        user?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'id' | 'firstName' | 'lastName'>
          )>
      }
        )
    }
      )>
  }
    )>
}
  );

export type GetProposalsHomescreenQueryVariables = Exact<{
  fundingPaginate: PaginateInput;
  joinPaginate: PaginateInput;
}>;


export type GetProposalsHomescreenQuery = (
  { __typename?: 'Query' }
  & {
  funding?: Maybe<Array<Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'commonId' | 'votesFor' | 'votesAgainst' | 'title' | 'description'>
    & {
    funding?: Maybe<(
      { __typename?: 'FundingProposal' }
      & Pick<FundingProposal, 'amount'>
      )>
  }
    )>>>, join?: Maybe<Array<Maybe<(
    { __typename?: 'Proposal' }
    & Pick<Proposal, 'id' | 'commonId' | 'title' | 'description'>
    & {
    join?: Maybe<(
      { __typename?: 'JoinProposal' }
      & Pick<JoinProposal, 'funding' | 'fundingType'>
      )>
  }
    )>>>
}
  );

export type RoleDetailsQueryVariables = Exact<{
  roleName: Scalars['String'];
}>;


export type RoleDetailsQuery = (
  { __typename?: 'Query' }
  & {
  role?: Maybe<(
    { __typename?: 'Role' }
    & Pick<Role, 'id' | 'name' | 'displayName' | 'description' | 'permissions'>
    & {
    users: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'photo' | 'displayName' | 'email'>
      )>
  }
    )>
}
  );

export type RolesQueryVariables = Exact<{ [key: string]: never; }>;


export type RolesQuery = (
  { __typename?: 'Query' }
  & {
  roles?: Maybe<Array<Maybe<(
    { __typename?: 'Role' }
    & Pick<Role, 'id' | 'name' | 'displayName' | 'description'>
    )>>>
}
  );

export type GetUserDetailsQueryQueryVariables = Exact<{
  where: UserWhereUniqueInput;
}>;


export type GetUserDetailsQueryQuery = (
  { __typename?: 'Query' }
  & {
  user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'createdAt' | 'photo'>
    & {
    proposals: Array<(
      { __typename?: 'Proposal' }
      & Pick<Proposal, 'id' | 'type' | 'state' | 'title'>
      & {
      join?: Maybe<(
        { __typename?: 'JoinProposal' }
        & Pick<JoinProposal, 'paymentState'>
        )>
    }
      )>, subscriptions: Array<(
      { __typename?: 'CommonSubscription' }
      & Pick<CommonSubscription, 'id' | 'amount' | 'status' | 'voided' | 'createdAt' | 'updatedAt' | 'chargedAt' | 'dueDate'>
      & {
      common: (
        { __typename?: 'Common' }
        & Pick<Common, 'id' | 'name'>
        )
    }
      )>
  }
    )>
}
  );

export type GetUsersHomepageDataQueryVariables = Exact<{
  paginate: PaginateInput;
  where?: Maybe<UserWhereInput>;
}>;


export type GetUsersHomepageDataQuery = (
  { __typename?: 'Query' }
  & {
  users?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'photo' | 'email' | 'firstName' | 'lastName' | 'createdAt'>
    )>>>
}
  );


export const WhitelistCommonDocument = gql`
  mutation whitelistCommon($commonId: String!) {
    whitelistCommon(commonId: $commonId)
  }
`;
export type WhitelistCommonMutationFn = Apollo.MutationFunction<WhitelistCommonMutation, WhitelistCommonMutationVariables>;

/**
 * __useWhitelistCommonMutation__
 *
 * To run a mutation, you first call `useWhitelistCommonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWhitelistCommonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [whitelistCommonMutation, { data, loading, error }] = useWhitelistCommonMutation({
 *   variables: {
 *      commonId: // value for 'commonId'
 *   },
 * });
 */
export function useWhitelistCommonMutation(baseOptions?: Apollo.MutationHookOptions<WhitelistCommonMutation, WhitelistCommonMutationVariables>) {
  return Apollo.useMutation<WhitelistCommonMutation, WhitelistCommonMutationVariables>(WhitelistCommonDocument, baseOptions);
}
export type WhitelistCommonMutationHookResult = ReturnType<typeof useWhitelistCommonMutation>;
export type WhitelistCommonMutationResult = Apollo.MutationResult<WhitelistCommonMutation>;
export type WhitelistCommonMutationOptions = Apollo.BaseMutationOptions<WhitelistCommonMutation, WhitelistCommonMutationVariables>;
export const DelistCommonDocument = gql`
  mutation delistCommon($commonId: String!) {
    delistCommon(commonId: $commonId)
  }
`;
export type DelistCommonMutationFn = Apollo.MutationFunction<DelistCommonMutation, DelistCommonMutationVariables>;

/**
 * __useDelistCommonMutation__
 *
 * To run a mutation, you first call `useDelistCommonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelistCommonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delistCommonMutation, { data, loading, error }] = useDelistCommonMutation({
 *   variables: {
 *      commonId: // value for 'commonId'
 *   },
 * });
 */
export function useDelistCommonMutation(baseOptions?: Apollo.MutationHookOptions<DelistCommonMutation, DelistCommonMutationVariables>) {
  return Apollo.useMutation<DelistCommonMutation, DelistCommonMutationVariables>(DelistCommonDocument, baseOptions);
}
export type DelistCommonMutationHookResult = ReturnType<typeof useDelistCommonMutation>;
export type DelistCommonMutationResult = Apollo.MutationResult<DelistCommonMutation>;
export type DelistCommonMutationOptions = Apollo.BaseMutationOptions<DelistCommonMutation, DelistCommonMutationVariables>;
export const CommonSearchDocument = gql`
  query commonSearch($where: CommonWhereInput) {
    commons(where: $where) {
      id
      name
      description
    }
  }
`;

/**
 * __useCommonSearchQuery__
 *
 * To run a query within a React component, call `useCommonSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommonSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommonSearchQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useCommonSearchQuery(baseOptions?: Apollo.QueryHookOptions<CommonSearchQuery, CommonSearchQueryVariables>) {
  return Apollo.useQuery<CommonSearchQuery, CommonSearchQueryVariables>(CommonSearchDocument, baseOptions);
}
export function useCommonSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommonSearchQuery, CommonSearchQueryVariables>) {
  return Apollo.useLazyQuery<CommonSearchQuery, CommonSearchQueryVariables>(CommonSearchDocument, baseOptions);
}
export type CommonSearchQueryHookResult = ReturnType<typeof useCommonSearchQuery>;
export type CommonSearchLazyQueryHookResult = ReturnType<typeof useCommonSearchLazyQuery>;
export type CommonSearchQueryResult = Apollo.QueryResult<CommonSearchQuery, CommonSearchQueryVariables>;
export const UserSearchDocument = gql`
  query userSearch($where: UserWhereInput) {
    users(where: $where) {
      id
      email
      firstName
      lastName
    }
  }
`;

/**
 * __useUserSearchQuery__
 *
 * To run a query within a React component, call `useUserSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSearchQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useUserSearchQuery(baseOptions?: Apollo.QueryHookOptions<UserSearchQuery, UserSearchQueryVariables>) {
  return Apollo.useQuery<UserSearchQuery, UserSearchQueryVariables>(UserSearchDocument, baseOptions);
}
export function useUserSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserSearchQuery, UserSearchQueryVariables>) {
  return Apollo.useLazyQuery<UserSearchQuery, UserSearchQueryVariables>(UserSearchDocument, baseOptions);
}
export type UserSearchQueryHookResult = ReturnType<typeof useUserSearchQuery>;
export type UserSearchLazyQueryHookResult = ReturnType<typeof useUserSearchLazyQuery>;
export type UserSearchQueryResult = Apollo.QueryResult<UserSearchQuery, UserSearchQueryVariables>;
export const ProposalSeachDocument = gql`
  query proposalSeach($where: ProposalWhereInput) {
    proposals(where: $where) {
      id
      title
      description
      type
    }
  }
`;

/**
 * __useProposalSeachQuery__
 *
 * To run a query within a React component, call `useProposalSeachQuery` and pass it any options that fit your needs.
 * When your component renders, `useProposalSeachQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProposalSeachQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useProposalSeachQuery(baseOptions?: Apollo.QueryHookOptions<ProposalSeachQuery, ProposalSeachQueryVariables>) {
  return Apollo.useQuery<ProposalSeachQuery, ProposalSeachQueryVariables>(ProposalSeachDocument, baseOptions);
}
export function useProposalSeachLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProposalSeachQuery, ProposalSeachQueryVariables>) {
  return Apollo.useLazyQuery<ProposalSeachQuery, ProposalSeachQueryVariables>(ProposalSeachDocument, baseOptions);
}
export type ProposalSeachQueryHookResult = ReturnType<typeof useProposalSeachQuery>;
export type ProposalSeachLazyQueryHookResult = ReturnType<typeof useProposalSeachLazyQuery>;
export type ProposalSeachQueryResult = Apollo.QueryResult<ProposalSeachQuery, ProposalSeachQueryVariables>;
export const GetLatestEventsDocument = gql`
  query GetLatestEvents($take: Int = 10, $skip: Int = 0) {
    events(paginate: {take: $take, skip: $skip}) {
      id
      createdAt
      type
      user {
        firstName
        lastName
        photo
      }
    }
  }
`;

/**
 * __useGetLatestEventsQuery__
 *
 * To run a query within a React component, call `useGetLatestEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestEventsQuery({
 *   variables: {
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetLatestEventsQuery(baseOptions?: Apollo.QueryHookOptions<GetLatestEventsQuery, GetLatestEventsQueryVariables>) {
  return Apollo.useQuery<GetLatestEventsQuery, GetLatestEventsQueryVariables>(GetLatestEventsDocument, baseOptions);
}
export function useGetLatestEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestEventsQuery, GetLatestEventsQueryVariables>) {
  return Apollo.useLazyQuery<GetLatestEventsQuery, GetLatestEventsQueryVariables>(GetLatestEventsDocument, baseOptions);
}
export type GetLatestEventsQueryHookResult = ReturnType<typeof useGetLatestEventsQuery>;
export type GetLatestEventsLazyQueryHookResult = ReturnType<typeof useGetLatestEventsLazyQuery>;
export type GetLatestEventsQueryResult = Apollo.QueryResult<GetLatestEventsQuery, GetLatestEventsQueryVariables>;
export const GetPaymentsDocument = gql`
  query GetPayments($paginate: PaginateInput) {
    payments(paginate: $paginate) {
      id
      type
      status
      amount
      type
      commonId
      fees
      user {
        id
        firstName
        lastName
        photo
        email
      }
    }
  }
`;

/**
 * __useGetPaymentsQuery__
 *
 * To run a query within a React component, call `useGetPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentsQuery({
 *   variables: {
 *      paginate: // value for 'paginate'
 *   },
 * });
 */
export function useGetPaymentsQuery(baseOptions?: Apollo.QueryHookOptions<GetPaymentsQuery, GetPaymentsQueryVariables>) {
  return Apollo.useQuery<GetPaymentsQuery, GetPaymentsQueryVariables>(GetPaymentsDocument, baseOptions);
}
export function useGetPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentsQuery, GetPaymentsQueryVariables>) {
  return Apollo.useLazyQuery<GetPaymentsQuery, GetPaymentsQueryVariables>(GetPaymentsDocument, baseOptions);
}
export type GetPaymentsQueryHookResult = ReturnType<typeof useGetPaymentsQuery>;
export type GetPaymentsLazyQueryHookResult = ReturnType<typeof useGetPaymentsLazyQuery>;
export type GetPaymentsQueryResult = Apollo.QueryResult<GetPaymentsQuery, GetPaymentsQueryVariables>;
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

/**
 * __useLoadUserContextQuery__
 *
 * To run a query within a React component, call `useLoadUserContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadUserContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadUserContextQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoadUserContextQuery(baseOptions?: Apollo.QueryHookOptions<LoadUserContextQuery, LoadUserContextQueryVariables>) {
  return Apollo.useQuery<LoadUserContextQuery, LoadUserContextQueryVariables>(LoadUserContextDocument, baseOptions);
}
export function useLoadUserContextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoadUserContextQuery, LoadUserContextQueryVariables>) {
  return Apollo.useLazyQuery<LoadUserContextQuery, LoadUserContextQueryVariables>(LoadUserContextDocument, baseOptions);
}
export type LoadUserContextQueryHookResult = ReturnType<typeof useLoadUserContextQuery>;
export type LoadUserContextLazyQueryHookResult = ReturnType<typeof useLoadUserContextLazyQuery>;
export type LoadUserContextQueryResult = Apollo.QueryResult<LoadUserContextQuery, LoadUserContextQueryVariables>;
export const GetCommonDetailsDocument = gql`
  query getCommonDetails($commonId: ID!, $paginate: PaginateInput!) {
    common(where: {id: $commonId}) {
      name
      createdAt
      updatedAt
      balance
      raised
      fundingType
      activeJoinProposals
      activeFundingProposals
      byline
      action
      description
      image
      whitelisted
      members {
        createdAt
        userId
        roles
        user {
          firstName
          lastName
        }
      }
      proposals(paginate: $paginate) {
        id
        type
        title
        description
        funding {
          amount
        }
        join {
          fundingType
          funding
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
 *      paginate: // value for 'paginate'
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
  query getCommonsHomescreenData($take: Int = 10, $skip: Int) {
    commons(paginate: {take: $take, skip: $skip}) {
      id
      name
      raised
      balance
      createdAt
      updatedAt
      members {
        userId
      }
      description
      byline
      fundingType
      fundingMinimumAmount
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
 *      take: // value for 'take'
 *      skip: // value for 'skip'
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
export const GetAllTimeStatistiscDocument = gql`
  query getAllTimeStatistisc {
    getStatistics(where: {type: AllTime}) {
      users
      commons
      joinProposals
      fundingProposals
    }
  }
`;

/**
 * __useGetAllTimeStatistiscQuery__
 *
 * To run a query within a React component, call `useGetAllTimeStatistiscQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTimeStatistiscQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTimeStatistiscQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTimeStatistiscQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>) {
  return Apollo.useQuery<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>(GetAllTimeStatistiscDocument, baseOptions);
}
export function useGetAllTimeStatistiscLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>) {
  return Apollo.useLazyQuery<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>(GetAllTimeStatistiscDocument, baseOptions);
}
export type GetAllTimeStatistiscQueryHookResult = ReturnType<typeof useGetAllTimeStatistiscQuery>;
export type GetAllTimeStatistiscLazyQueryHookResult = ReturnType<typeof useGetAllTimeStatistiscLazyQuery>;
export type GetAllTimeStatistiscQueryResult = Apollo.QueryResult<GetAllTimeStatistiscQuery, GetAllTimeStatistiscQueryVariables>;
export const GetProposalsSelectedForBatchDocument = gql`
  query getProposalsSelectedForBatch($where: ProposalWhereInput!) {
    proposals(where: $where) {
      id
      state
      user {
        id
        firstName
        lastName
      }
      title
      description
      common {
        name
      }
      funding {
        fundingState
        amount
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
 *      where: // value for 'where'
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
export const AvailableWiresDocument = gql`
  query availableWires($where: WireWhereInput!) {
    wires(where: $where) {
      id
      description
    }
  }
`;

/**
 * __useAvailableWiresQuery__
 *
 * To run a query within a React component, call `useAvailableWiresQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableWiresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableWiresQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useAvailableWiresQuery(baseOptions: Apollo.QueryHookOptions<AvailableWiresQuery, AvailableWiresQueryVariables>) {
  return Apollo.useQuery<AvailableWiresQuery, AvailableWiresQueryVariables>(AvailableWiresDocument, baseOptions);
}
export function useAvailableWiresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableWiresQuery, AvailableWiresQueryVariables>) {
  return Apollo.useLazyQuery<AvailableWiresQuery, AvailableWiresQueryVariables>(AvailableWiresDocument, baseOptions);
}
export type AvailableWiresQueryHookResult = ReturnType<typeof useAvailableWiresQuery>;
export type AvailableWiresLazyQueryHookResult = ReturnType<typeof useAvailableWiresLazyQuery>;
export type AvailableWiresQueryResult = Apollo.QueryResult<AvailableWiresQuery, AvailableWiresQueryVariables>;
export const CreatePayoutDocument = gql`
  mutation createPayout($input: CreatePayoutInput!) {
    createPayout(input: $input) {
      id
    }
  }
`;
export type CreatePayoutMutationFn = Apollo.MutationFunction<CreatePayoutMutation, CreatePayoutMutationVariables>;

/**
 * __useCreatePayoutMutation__
 *
 * To run a mutation, you first call `useCreatePayoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePayoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPayoutMutation, { data, loading, error }] = useCreatePayoutMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePayoutMutation(baseOptions?: Apollo.MutationHookOptions<CreatePayoutMutation, CreatePayoutMutationVariables>) {
  return Apollo.useMutation<CreatePayoutMutation, CreatePayoutMutationVariables>(CreatePayoutDocument, baseOptions);
}
export type CreatePayoutMutationHookResult = ReturnType<typeof useCreatePayoutMutation>;
export type CreatePayoutMutationResult = Apollo.MutationResult<CreatePayoutMutation>;
export type CreatePayoutMutationOptions = Apollo.BaseMutationOptions<CreatePayoutMutation, CreatePayoutMutationVariables>;
export const GetPayoutDetailsDocument = gql`
  query GetPayoutDetails($payoutId: ID!) {
    payout(id: $payoutId) {
      status
      proposals {
        id
        funding {
          amount
        }
        title
        description
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
export const PayoutsPageDataDocument = gql`
  query PayoutsPageData {
    proposals(fundingWhere: {fundingState: Eligible}) {
      id
      userId
      commonId
      title
      description
      funding {
        amount
      }
    }
    payouts(where: {status: {in: [PendingApproval, CirclePending]}}) {
      id
      amount
      createdAt
      updatedAt
      description
    }
  }
`;

/**
 * __usePayoutsPageDataQuery__
 *
 * To run a query within a React component, call `usePayoutsPageDataQuery` and pass it any options that fit your needs.
 * When your component renders, `usePayoutsPageDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePayoutsPageDataQuery({
 *   variables: {
 *   },
 * });
 */
export function usePayoutsPageDataQuery(baseOptions?: Apollo.QueryHookOptions<PayoutsPageDataQuery, PayoutsPageDataQueryVariables>) {
  return Apollo.useQuery<PayoutsPageDataQuery, PayoutsPageDataQueryVariables>(PayoutsPageDataDocument, baseOptions);
}
export function usePayoutsPageDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PayoutsPageDataQuery, PayoutsPageDataQueryVariables>) {
  return Apollo.useLazyQuery<PayoutsPageDataQuery, PayoutsPageDataQueryVariables>(PayoutsPageDataDocument, baseOptions);
}
export type PayoutsPageDataQueryHookResult = ReturnType<typeof usePayoutsPageDataQuery>;
export type PayoutsPageDataLazyQueryHookResult = ReturnType<typeof usePayoutsPageDataLazyQuery>;
export type PayoutsPageDataQueryResult = Apollo.QueryResult<PayoutsPageDataQuery, PayoutsPageDataQueryVariables>;
export const GetNotificationEventsDocument = gql`
  query GetNotificationEvents($paginate: PaginateInput!) {
    notificationEventSettings(paginate: $paginate) {
      id
      sendToEveryone
      sendToCommon
      sendToUser
      description
      sendNotificationType
      onEvent
    }
  }
`;

/**
 * __useGetNotificationEventsQuery__
 *
 * To run a query within a React component, call `useGetNotificationEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationEventsQuery({
 *   variables: {
 *      paginate: // value for 'paginate'
 *   },
 * });
 */
export function useGetNotificationEventsQuery(baseOptions: Apollo.QueryHookOptions<GetNotificationEventsQuery, GetNotificationEventsQueryVariables>) {
  return Apollo.useQuery<GetNotificationEventsQuery, GetNotificationEventsQueryVariables>(GetNotificationEventsDocument, baseOptions);
}
export function useGetNotificationEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationEventsQuery, GetNotificationEventsQueryVariables>) {
  return Apollo.useLazyQuery<GetNotificationEventsQuery, GetNotificationEventsQueryVariables>(GetNotificationEventsDocument, baseOptions);
}
export type GetNotificationEventsQueryHookResult = ReturnType<typeof useGetNotificationEventsQuery>;
export type GetNotificationEventsLazyQueryHookResult = ReturnType<typeof useGetNotificationEventsLazyQuery>;
export type GetNotificationEventsQueryResult = Apollo.QueryResult<GetNotificationEventsQuery, GetNotificationEventsQueryVariables>;
export const GetCreateNotificationEventOptionsDocument = gql`
  query GetCreateNotificationEventOptions {
    notificationEventOptions {
      availableEvents
      availableNotifications
    }
  }
`;

/**
 * __useGetCreateNotificationEventOptionsQuery__
 *
 * To run a query within a React component, call `useGetCreateNotificationEventOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCreateNotificationEventOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCreateNotificationEventOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCreateNotificationEventOptionsQuery(baseOptions?: Apollo.QueryHookOptions<GetCreateNotificationEventOptionsQuery, GetCreateNotificationEventOptionsQueryVariables>) {
  return Apollo.useQuery<GetCreateNotificationEventOptionsQuery, GetCreateNotificationEventOptionsQueryVariables>(GetCreateNotificationEventOptionsDocument, baseOptions);
}
export function useGetCreateNotificationEventOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCreateNotificationEventOptionsQuery, GetCreateNotificationEventOptionsQueryVariables>) {
  return Apollo.useLazyQuery<GetCreateNotificationEventOptionsQuery, GetCreateNotificationEventOptionsQueryVariables>(GetCreateNotificationEventOptionsDocument, baseOptions);
}
export type GetCreateNotificationEventOptionsQueryHookResult = ReturnType<typeof useGetCreateNotificationEventOptionsQuery>;
export type GetCreateNotificationEventOptionsLazyQueryHookResult = ReturnType<typeof useGetCreateNotificationEventOptionsLazyQuery>;
export type GetCreateNotificationEventOptionsQueryResult = Apollo.QueryResult<GetCreateNotificationEventOptionsQuery, GetCreateNotificationEventOptionsQueryVariables>;
export const CreateNotificationEventIntegrationDocument = gql`
  mutation CreateNotificationEventIntegration($input: CreateNotificationEventSettingsInput!) {
    createNotificationEventSettings(input: $input) {
      id
    }
  }
`;
export type CreateNotificationEventIntegrationMutationFn = Apollo.MutationFunction<CreateNotificationEventIntegrationMutation, CreateNotificationEventIntegrationMutationVariables>;

/**
 * __useCreateNotificationEventIntegrationMutation__
 *
 * To run a mutation, you first call `useCreateNotificationEventIntegrationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNotificationEventIntegrationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNotificationEventIntegrationMutation, { data, loading, error }] = useCreateNotificationEventIntegrationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNotificationEventIntegrationMutation(baseOptions?: Apollo.MutationHookOptions<CreateNotificationEventIntegrationMutation, CreateNotificationEventIntegrationMutationVariables>) {
  return Apollo.useMutation<CreateNotificationEventIntegrationMutation, CreateNotificationEventIntegrationMutationVariables>(CreateNotificationEventIntegrationDocument, baseOptions);
}
export type CreateNotificationEventIntegrationMutationHookResult = ReturnType<typeof useCreateNotificationEventIntegrationMutation>;
export type CreateNotificationEventIntegrationMutationResult = Apollo.MutationResult<CreateNotificationEventIntegrationMutation>;
export type CreateNotificationEventIntegrationMutationOptions = Apollo.BaseMutationOptions<CreateNotificationEventIntegrationMutation, CreateNotificationEventIntegrationMutationVariables>;
export const GetAllUsersNotificationsDocument = gql`
  query getAllUsersNotifications($paginate: PaginateInput!) {
    notifications(paginate: $paginate) {
      id
      type
      createdAt
      seenStatus
      user {
        photo
        displayName
      }
    }
  }
`;

/**
 * __useGetAllUsersNotificationsQuery__
 *
 * To run a query within a React component, call `useGetAllUsersNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersNotificationsQuery({
 *   variables: {
 *      paginate: // value for 'paginate'
 *   },
 * });
 */
export function useGetAllUsersNotificationsQuery(baseOptions: Apollo.QueryHookOptions<GetAllUsersNotificationsQuery, GetAllUsersNotificationsQueryVariables>) {
  return Apollo.useQuery<GetAllUsersNotificationsQuery, GetAllUsersNotificationsQueryVariables>(GetAllUsersNotificationsDocument, baseOptions);
}
export function useGetAllUsersNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersNotificationsQuery, GetAllUsersNotificationsQueryVariables>) {
  return Apollo.useLazyQuery<GetAllUsersNotificationsQuery, GetAllUsersNotificationsQueryVariables>(GetAllUsersNotificationsDocument, baseOptions);
}
export type GetAllUsersNotificationsQueryHookResult = ReturnType<typeof useGetAllUsersNotificationsQuery>;
export type GetAllUsersNotificationsLazyQueryHookResult = ReturnType<typeof useGetAllUsersNotificationsLazyQuery>;
export type GetAllUsersNotificationsQueryResult = Apollo.QueryResult<GetAllUsersNotificationsQuery, GetAllUsersNotificationsQueryVariables>;
export const LoadNotificationSettignsDocument = gql`
  query LoadNotificationSettigns {
    notificationSettings {
      id
      createdAt
      updatedAt
      type
      sendEmail
      sendPush
      showInUserFeed
    }
  }
`;

/**
 * __useLoadNotificationSettignsQuery__
 *
 * To run a query within a React component, call `useLoadNotificationSettignsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadNotificationSettignsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadNotificationSettignsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoadNotificationSettignsQuery(baseOptions?: Apollo.QueryHookOptions<LoadNotificationSettignsQuery, LoadNotificationSettignsQueryVariables>) {
  return Apollo.useQuery<LoadNotificationSettignsQuery, LoadNotificationSettignsQueryVariables>(LoadNotificationSettignsDocument, baseOptions);
}
export function useLoadNotificationSettignsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoadNotificationSettignsQuery, LoadNotificationSettignsQueryVariables>) {
  return Apollo.useLazyQuery<LoadNotificationSettignsQuery, LoadNotificationSettignsQueryVariables>(LoadNotificationSettignsDocument, baseOptions);
}
export type LoadNotificationSettignsQueryHookResult = ReturnType<typeof useLoadNotificationSettignsQuery>;
export type LoadNotificationSettignsLazyQueryHookResult = ReturnType<typeof useLoadNotificationSettignsLazyQuery>;
export type LoadNotificationSettignsQueryResult = Apollo.QueryResult<LoadNotificationSettignsQuery, LoadNotificationSettignsQueryVariables>;
export const UpdateNotificationSettingsDocument = gql`
  mutation UpdateNotificationSettings($input: UpdateNotificationSettingsInput!) {
    updateNotificationSettings(input: $input) {
      id
    }
  }
`;
export type UpdateNotificationSettingsMutationFn = Apollo.MutationFunction<UpdateNotificationSettingsMutation, UpdateNotificationSettingsMutationVariables>;

/**
 * __useUpdateNotificationSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateNotificationSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNotificationSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNotificationSettingsMutation, { data, loading, error }] = useUpdateNotificationSettingsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNotificationSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNotificationSettingsMutation, UpdateNotificationSettingsMutationVariables>) {
  return Apollo.useMutation<UpdateNotificationSettingsMutation, UpdateNotificationSettingsMutationVariables>(UpdateNotificationSettingsDocument, baseOptions);
}
export type UpdateNotificationSettingsMutationHookResult = ReturnType<typeof useUpdateNotificationSettingsMutation>;
export type UpdateNotificationSettingsMutationResult = Apollo.MutationResult<UpdateNotificationSettingsMutation>;
export type UpdateNotificationSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateNotificationSettingsMutation, UpdateNotificationSettingsMutationVariables>;
export const NotificationOptionsDocument = gql`
  query NotificationOptions {
    notificationTemplate: notificationTemplateOptions {
      languages
      templateTypes
      notificationTypes
    }
  }
`;

/**
 * __useNotificationOptionsQuery__
 *
 * To run a query within a React component, call `useNotificationOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationOptionsQuery(baseOptions?: Apollo.QueryHookOptions<NotificationOptionsQuery, NotificationOptionsQueryVariables>) {
  return Apollo.useQuery<NotificationOptionsQuery, NotificationOptionsQueryVariables>(NotificationOptionsDocument, baseOptions);
}
export function useNotificationOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationOptionsQuery, NotificationOptionsQueryVariables>) {
  return Apollo.useLazyQuery<NotificationOptionsQuery, NotificationOptionsQueryVariables>(NotificationOptionsDocument, baseOptions);
}
export type NotificationOptionsQueryHookResult = ReturnType<typeof useNotificationOptionsQuery>;
export type NotificationOptionsLazyQueryHookResult = ReturnType<typeof useNotificationOptionsLazyQuery>;
export type NotificationOptionsQueryResult = Apollo.QueryResult<NotificationOptionsQuery, NotificationOptionsQueryVariables>;
export const CreateNotificationTemplateDocument = gql`
  mutation CreateNotificationTemplate($input: CreateNotificationTemplateInput!) {
    createNotificationTemplate(input: $input) {
      id
    }
  }
`;
export type CreateNotificationTemplateMutationFn = Apollo.MutationFunction<CreateNotificationTemplateMutation, CreateNotificationTemplateMutationVariables>;

/**
 * __useCreateNotificationTemplateMutation__
 *
 * To run a mutation, you first call `useCreateNotificationTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNotificationTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNotificationTemplateMutation, { data, loading, error }] = useCreateNotificationTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNotificationTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateNotificationTemplateMutation, CreateNotificationTemplateMutationVariables>) {
  return Apollo.useMutation<CreateNotificationTemplateMutation, CreateNotificationTemplateMutationVariables>(CreateNotificationTemplateDocument, baseOptions);
}
export type CreateNotificationTemplateMutationHookResult = ReturnType<typeof useCreateNotificationTemplateMutation>;
export type CreateNotificationTemplateMutationResult = Apollo.MutationResult<CreateNotificationTemplateMutation>;
export type CreateNotificationTemplateMutationOptions = Apollo.BaseMutationOptions<CreateNotificationTemplateMutation, CreateNotificationTemplateMutationVariables>;
export const AllTemplatesForTypeDocument = gql`
  query allTemplatesForType($forType: NotificationType!) {
    notificationSettings(where: {type: $forType}) {
      sendEmail
      sendPush
      showInUserFeed
    }
    notificationTemplates(where: {forType: $forType}) {
      id
      templateType
      language
      subject
      content
      from
      fromName
    }
  }
`;

/**
 * __useAllTemplatesForTypeQuery__
 *
 * To run a query within a React component, call `useAllTemplatesForTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllTemplatesForTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllTemplatesForTypeQuery({
 *   variables: {
 *      forType: // value for 'forType'
 *   },
 * });
 */
export function useAllTemplatesForTypeQuery(baseOptions: Apollo.QueryHookOptions<AllTemplatesForTypeQuery, AllTemplatesForTypeQueryVariables>) {
  return Apollo.useQuery<AllTemplatesForTypeQuery, AllTemplatesForTypeQueryVariables>(AllTemplatesForTypeDocument, baseOptions);
}
export function useAllTemplatesForTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllTemplatesForTypeQuery, AllTemplatesForTypeQueryVariables>) {
  return Apollo.useLazyQuery<AllTemplatesForTypeQuery, AllTemplatesForTypeQueryVariables>(AllTemplatesForTypeDocument, baseOptions);
}
export type AllTemplatesForTypeQueryHookResult = ReturnType<typeof useAllTemplatesForTypeQuery>;
export type AllTemplatesForTypeLazyQueryHookResult = ReturnType<typeof useAllTemplatesForTypeLazyQuery>;
export type AllTemplatesForTypeQueryResult = Apollo.QueryResult<AllTemplatesForTypeQuery, AllTemplatesForTypeQueryVariables>;
export const UpdateTemplateDocument = gql`
  mutation UpdateTemplate($input: UpdateNotificationTemplateInput!) {
    updateNotificationTemplate(input: $input) {
      id
    }
  }
`;
export type UpdateTemplateMutationFn = Apollo.MutationFunction<UpdateTemplateMutation, UpdateTemplateMutationVariables>;

/**
 * __useUpdateTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTemplateMutation, { data, loading, error }] = useUpdateTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTemplateMutation, UpdateTemplateMutationVariables>) {
  return Apollo.useMutation<UpdateTemplateMutation, UpdateTemplateMutationVariables>(UpdateTemplateDocument, baseOptions);
}
export type UpdateTemplateMutationHookResult = ReturnType<typeof useUpdateTemplateMutation>;
export type UpdateTemplateMutationResult = Apollo.MutationResult<UpdateTemplateMutation>;
export type UpdateTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateTemplateMutation, UpdateTemplateMutationVariables>;
export const GetNotificaitonTemplatesDocument = gql`
  query getNotificaitonTemplates($paginate: PaginateInput!, $where: NotificationTemplateWhereInput) {
    notificationTemplates(paginate: $paginate, where: $where) {
      id
      createdAt
      updatedAt
      subject
      forType
      language
      templateType
    }
  }
`;

/**
 * __useGetNotificaitonTemplatesQuery__
 *
 * To run a query within a React component, call `useGetNotificaitonTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificaitonTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificaitonTemplatesQuery({
 *   variables: {
 *      paginate: // value for 'paginate'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetNotificaitonTemplatesQuery(baseOptions: Apollo.QueryHookOptions<GetNotificaitonTemplatesQuery, GetNotificaitonTemplatesQueryVariables>) {
  return Apollo.useQuery<GetNotificaitonTemplatesQuery, GetNotificaitonTemplatesQueryVariables>(GetNotificaitonTemplatesDocument, baseOptions);
}
export function useGetNotificaitonTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotificaitonTemplatesQuery, GetNotificaitonTemplatesQueryVariables>) {
  return Apollo.useLazyQuery<GetNotificaitonTemplatesQuery, GetNotificaitonTemplatesQueryVariables>(GetNotificaitonTemplatesDocument, baseOptions);
}
export type GetNotificaitonTemplatesQueryHookResult = ReturnType<typeof useGetNotificaitonTemplatesQuery>;
export type GetNotificaitonTemplatesLazyQueryHookResult = ReturnType<typeof useGetNotificaitonTemplatesLazyQuery>;
export type GetNotificaitonTemplatesQueryResult = Apollo.QueryResult<GetNotificaitonTemplatesQuery, GetNotificaitonTemplatesQueryVariables>;
export const GetProposalDetailsDocument = gql`
  query getProposalDetails($where: ProposalWhereUniqueInput!) {
    proposal(where: $where) {
      id
      join {
        funding
        fundingType
        paymentState
      }
      funding {
        amount
        fundingState
      }
      type
      createdAt
      updatedAt
      votesFor
      votesAgainst
      state
      user {
        id
        firstName
        lastName
      }
      common {
        members {
          userId
        }
      }
      description
      votes {
        id
        outcome
        voter {
          user {
            id
            firstName
            lastName
          }
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
 *      where: // value for 'where'
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
export const GetProposalsHomescreenDocument = gql`
  query getProposalsHomescreen($fundingPaginate: PaginateInput!, $joinPaginate: PaginateInput!) {
    funding: proposals(where: {type: FundingRequest}, paginate: $fundingPaginate) {
      id
      commonId
      votesFor
      votesAgainst
      title
      description
      funding {
        amount
      }
    }
    join: proposals(where: {type: JoinRequest}, paginate: $joinPaginate) {
      id
      commonId
      title
      description
      join {
        funding
        fundingType
      }
    }
  }
`;

/**
 * __useGetProposalsHomescreenQuery__
 *
 * To run a query within a React component, call `useGetProposalsHomescreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalsHomescreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalsHomescreenQuery({
 *   variables: {
 *      fundingPaginate: // value for 'fundingPaginate'
 *      joinPaginate: // value for 'joinPaginate'
 *   },
 * });
 */
export function useGetProposalsHomescreenQuery(baseOptions: Apollo.QueryHookOptions<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>) {
  return Apollo.useQuery<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>(GetProposalsHomescreenDocument, baseOptions);
}

export function useGetProposalsHomescreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>) {
  return Apollo.useLazyQuery<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>(GetProposalsHomescreenDocument, baseOptions);
}

export type GetProposalsHomescreenQueryHookResult = ReturnType<typeof useGetProposalsHomescreenQuery>;
export type GetProposalsHomescreenLazyQueryHookResult = ReturnType<typeof useGetProposalsHomescreenLazyQuery>;
export type GetProposalsHomescreenQueryResult = Apollo.QueryResult<GetProposalsHomescreenQuery, GetProposalsHomescreenQueryVariables>;
export const RoleDetailsDocument = gql`
  query roleDetails($roleName: String!) {
    role(where: {name: $roleName}) {
      id
      name
      displayName
      description
      permissions
      users {
        id
        photo
        displayName
        email
      }
    }
  }
`;

/**
 * __useRoleDetailsQuery__
 *
 * To run a query within a React component, call `useRoleDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoleDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoleDetailsQuery({
 *   variables: {
 *      roleName: // value for 'roleName'
 *   },
 * });
 */
export function useRoleDetailsQuery(baseOptions: Apollo.QueryHookOptions<RoleDetailsQuery, RoleDetailsQueryVariables>) {
  return Apollo.useQuery<RoleDetailsQuery, RoleDetailsQueryVariables>(RoleDetailsDocument, baseOptions);
}

export function useRoleDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoleDetailsQuery, RoleDetailsQueryVariables>) {
  return Apollo.useLazyQuery<RoleDetailsQuery, RoleDetailsQueryVariables>(RoleDetailsDocument, baseOptions);
}

export type RoleDetailsQueryHookResult = ReturnType<typeof useRoleDetailsQuery>;
export type RoleDetailsLazyQueryHookResult = ReturnType<typeof useRoleDetailsLazyQuery>;
export type RoleDetailsQueryResult = Apollo.QueryResult<RoleDetailsQuery, RoleDetailsQueryVariables>;
export const RolesDocument = gql`
  query roles {
    roles {
      id
      name
      displayName
      description
    }
  }
`;

/**
 * __useRolesQuery__
 *
 * To run a query within a React component, call `useRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useRolesQuery(baseOptions?: Apollo.QueryHookOptions<RolesQuery, RolesQueryVariables>) {
  return Apollo.useQuery<RolesQuery, RolesQueryVariables>(RolesDocument, baseOptions);
}

export function useRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RolesQuery, RolesQueryVariables>) {
  return Apollo.useLazyQuery<RolesQuery, RolesQueryVariables>(RolesDocument, baseOptions);
}

export type RolesQueryHookResult = ReturnType<typeof useRolesQuery>;
export type RolesLazyQueryHookResult = ReturnType<typeof useRolesLazyQuery>;
export type RolesQueryResult = Apollo.QueryResult<RolesQuery, RolesQueryVariables>;
export const GetUserDetailsQueryDocument = gql`
  query getUserDetailsQuery($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      firstName
      lastName
      email
      createdAt
      photo
      proposals {
        id
        type
        state
        join {
          paymentState
        }
        title
      }
      subscriptions {
        id
        amount
        common {
          id
          name
        }
        status
        voided
        createdAt
        updatedAt
        chargedAt
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
 *      where: // value for 'where'
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
  query getUsersHomepageData($paginate: PaginateInput!, $where: UserWhereInput) {
    users(paginate: $paginate, where: $where) {
      id
      photo
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
 *      paginate: // value for 'paginate'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetUsersHomepageDataQuery(baseOptions: Apollo.QueryHookOptions<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>) {
  return Apollo.useQuery<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>(GetUsersHomepageDataDocument, baseOptions);
}
export function useGetUsersHomepageDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>) {
  return Apollo.useLazyQuery<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>(GetUsersHomepageDataDocument, baseOptions);
}
export type GetUsersHomepageDataQueryHookResult = ReturnType<typeof useGetUsersHomepageDataQuery>;
export type GetUsersHomepageDataLazyQueryHookResult = ReturnType<typeof useGetUsersHomepageDataLazyQuery>;
export type GetUsersHomepageDataQueryResult = Apollo.QueryResult<GetUsersHomepageDataQuery, GetUsersHomepageDataQueryVariables>;