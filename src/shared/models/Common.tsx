export interface Member {
  joinedAt: { seconds: number; nanoseconds: number };
  userId: string;
  permission?: Permission;
}

export interface CommonLink {
  title: string;
  value: string;
}

export interface CommonRule {
  title: string;
  value: string;
}

export enum CommonContributionType {
  OneTime = "one-time",
  Monthly = "monthly",
}

export enum Permission {
  Founder = "founder",
  Moderator = "moderator",
}

export interface Metadata {
  byline?: string;
  description?: string;
  founderId: string;
  minFeeToJoin: number;
  contributionType: CommonContributionType;
  zeroContribution?: boolean;
  searchable?: boolean;
}

export interface Common {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  balance: number;
  reservedBalance?: number;
  raised: number;
  links: CommonLink[];
  image: string;

  register: string;
  members: Member[];

  rules: CommonRule[];
  fundingGoalDeadline: number;

  metadata: Metadata;
  active: boolean;
}

export interface CommonPayment {
  link: string;
}
