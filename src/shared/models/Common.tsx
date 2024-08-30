import { SpaceListVisibility } from "../interfaces";
import { BaseEntity } from "./BaseEntity";
import { Discussion } from "./Discussion";
import { DiscussionMessage } from "./DiscussionMessage";
import { NotionIntegration } from "./NotionIntegration";
import { PaymentAmount } from "./Payment";
import { Proposal } from "./Proposals";
import { Timestamp } from "./Timestamp";
import { User } from "./User";
import {
  AllowedActions,
  AllowedProposals,
  Circles,
  CirclesMap,
} from "./governance/Circles";
import { Time } from "./shared";

export interface DirectParent {
  commonId: string;
  circleId: string;
}

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

  gallery: CommonLink[];

  tags?: string[];

  video: CommonLink | null;

  /**
   * Will this common appear in the search results page
   */
  searchable: boolean;

  /**
   * The currently available funds of
   */
  balance: PaymentAmount;

  /**
   * Reserved amount that is due to leave the common
   * until the process of payout is completed
   */
  reservedBalance: PaymentAmount;

  /**
   * The total amount of funds that the
   * common has raised to date
   */
  raised: PaymentAmount;

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

  directParent: DirectParent | null;

  governanceDocumentUrl?: string;

  /**
   * This is not fetched from the database. It's calcualted while the commons are fetched.
   */
  proposals?: Proposal[];
  discussions?: Discussion[];
  messages?: DiscussionMessage[];

  pinnedFeedItems: FeedItem[];

  hasPublicItems: boolean;

  rootCommonId?: string;

  lastActivity?: Timestamp;

  notion?: CommonNotion;

  listVisibility?: SpaceListVisibility;
}

export interface InheritedCircle {
  circleId?: string;
  inheritFrom?: {
    governanceId?: string;
    circleId?: string;
  };
}

export interface SpaceAdvancedSettings {
  permissionGovernanceId?: string;
  circles?: InheritedCircle[];
}

export interface Project extends Common {
  directParent: DirectParent;
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
  rulesAccepted?: boolean;
  joinedAt: Timestamp;
  circleIds: string[];
  isFollowing: boolean;
  streamsUnreadCountByProjectStream?: Record<string, number>;
  unreadCountByProjectStream?: Record<string, number>;
  commonId?: string;
}

export interface CirclesPermissions {
  allowedActions: AllowedActions;
  allowedProposals: AllowedProposals;
  circles: CirclesMap;
}

export interface CommonMemberWithUserInfo extends CommonMember {
  user: User;
}

export interface CommonMemberPreviewInfo {
  commons: {
    id: string;
    name: string;
    circles: Circles;
    circlesMap: CirclesMap["map"];
    userCircleNames?: string;
  }[];
  introToCommon?: string;
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

  size?: number;

  name?: string;
}

export interface CommonPayment {
  link: string;
}

export interface CommonNotion extends Omit<NotionIntegration, "token"> {
  title: string;
}

interface FeedItem {
  feedObjectId: string;
  pinnedAt: Time;
}
