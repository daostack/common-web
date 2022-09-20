import firebase from "firebase/app";
import {
  AllowedActions,
  AllowedProposals,
  CirclesMap,
} from "./governance/Circles";
import { Reputation } from "./governance/Reputation";
import { BaseEntity } from "./BaseEntity";
import { Proposal } from "./Proposals";
import { Discussion } from "./Discussion";
import { DiscussionMessage } from "./DiscussionMessage";
import { User } from "./User";

export interface Common extends BaseEntity {
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
   * Number of memebers in the common
   */
  memberCount: number;

  /**
   * The whitelisting status of the common
   */
  register: CommonRegistered;

  readonly governanceId: string | null;

  readonly founderId: string;

  state: CommonState;
  /**
   * Score of common for prioritization purposes
   */
  score: number;

  directParent: {
    commonId: string;
    circleId: string;
  } | null;

  /**
   * This is not fetched from the database. It's calcualted while the commons are fetched.
   */
  proposals?: Proposal[];
  discussions?: Discussion[];
  messages?: DiscussionMessage[];
}

/**
 * Used to showcase whether the common is whitelisted
 *
 * "na" - The common is not whitelisted and thus visible only to members
 * "registered" - The common is whitelisted and part of the featured list
 */
export enum CommonRegistered {
  NA = "na",
  REGISTERED = "registered",
}

export enum CommonState {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DRAFT = "DRAFT",
}

export interface CommonMember {
  readonly id: string;
  readonly userId: string;
  joinedAt: firebase.firestore.Timestamp;
  circles: CirclesMap;
  allowedActions: AllowedActions;
  allowedProposals: AllowedProposals;
  tokenBalance: number;
  reputation: Partial<Reputation>;
}

export interface CommonMemberWithUserInfo extends CommonMember {
  user: User;
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

export interface CommonPayment {
  link: string;
}
