export interface UserMemberships {
  id: string;
  commons: Record<string, { memberId: string; circleIds: string[] }>;
}
