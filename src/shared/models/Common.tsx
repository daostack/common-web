import { Reputation } from "./Reputation";

export interface Common {
  /**
  * The main identifier of the common
  */
  id: string;

  /**
   * The time that the entity was created
   */
  createdAt: Date;

  /**
   * The last time that the entity was modified
   */
  updatedAt: Date;
  /**
   * The name of the common showed in the app and
   * other places (email, notification etc.)
  */
  name: string;

  byline: string;

  description: string;

  /**
   * The URL of the image, used as header for
   * the common profile page
   */
  image: string;

  /**
   * List of links, that the common provided
   */
  links: CommonLink[];

  /**
  * Will this common appear in the search results page
  */
  searchable: boolean;

  /**
   * The currently available funds of
   * the common in cents
   */
  balance: number;

  /**
   * Reserved amount that is due to leave the common
   * until the process of payout is completed
   */
  reservedBalance: number;

  /**
   * The total amount of funds that the
   * common has raised to date in cents
   */
  raised: number;

  /**
 * Number of proposals in common
 */
  proposalCount: number;

  /**
   * Number of discussions in common
   */
  discussionCount: number;

  /**
   * Number of messages in all the discussions of the common
   */
  messageCount: number;

  /**
   * The whitelisting status of the common
   */
  register: CommonRegistered;

  /**
   * Subcollection of users, since a collection cant exist and be empty, it might be null until members are added.
   */
  readonly members: CommonMember[] | null;

  readonly founderId: string;

  readonly governanceId: string;

  state: CommonState;
}

/**
 * Used to showcase whether the common is whitelisted
 *
 * "na" - The common is not whitelisted and thus visible only to members
 * "registered" - The common is whitelisted and part of the featured list
 */
export enum CommonRegistered {
  NA = 'na',
  REGISTERED = 'registered',
}

export enum CommonState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT'
}

export interface CommonMember {
  readonly userId: string;
  joinedAt: Date;
  circles: {
    [key in string]: true
  };
  tokenBalance: number;
  reputation: Partial<Reputation>
}

export interface CommonLink {
  /**
   * The title of the link
   */
  title: string;

  /**
   * The address, to which the link is pointing
   */
  value: string;
}

export interface CommonRule {
  title: string;
  definition: string;
}


// export enum MemberPermission {
//   Founder = "founder",
//   Moderator = "moderator",
// }

// export interface Member {
//   joinedAt: { seconds: number; nanoseconds: number };
//   userId: string;
//   permission?: MemberPermission;
// }

// export interface CommonLink {
//   title: string;
//   value: string;
// }

// export enum CommonContributionType {
//   OneTime = "one-time",
//   Monthly = "monthly",
// }

// export interface Metadata {
//   byline?: string;
//   description?: string;
//   founderId: string;
//   minFeeToJoin: number;
//   contributionType: CommonContributionType;
//   zeroContribution?: boolean;
//   searchable?: boolean;
// }

// export interface CommonPayment {
//   link: string;
// }
