export interface Member {
  joinedAt: { seconds: number; nanoseconds: number };
  userId: string;
}
export interface Rules {
  title: string;
  value: string;
}

export enum CommonContributionType {
  OneTime = "one-time",
  Monthly = "monthly",
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
  raised: number;
  byline: string;
  description: string;
  links: Rules[];
  image: string;
  fundingType: CommonContributionType;
  openJoinRequests: number;
  openFundingRequests: number;

  register: string;
  members: Member[];

  rules: Rules[];
  fundingGoalDeadline: number;

  metadata: Metadata;
}
