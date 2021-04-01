export interface Member {
  joinedAt: { seconds: number; nanoseconds: number };
  userId: string;
}
export interface Rules {
  title: string;
  value: string;
}

export interface Common {
  image: string;
  createdAt: { seconds: number; nanoseconds: number };
  name: string;
  updatedAt: { seconds: number; nanoseconds: number };
  metadata: {
    action: string;
    byline: string;
    description: string;
    minFeeToJoin: number;
    founderId: string;
    contributionType?: string;
  };
  id: string;
  register: string;
  members: Member[];
  raised: number;
  rules: Rules[];
  balance: number;
  fundingGoalDeadline: number;
  links: Rules[];
}
