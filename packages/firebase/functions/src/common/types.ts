import { IBaseEntity } from '../util/types';
import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

export interface ICommonEntity extends IBaseEntity {
  /**
   * The name of the common showed in the app and
   * other places (email, notification etc.)
   */
  name: string;

  /**
   * The URL of the image, used as header for
   * the common profile page
   */
  image: string;

  /**
   * The currently available funds of
   * the common in cents
   */
  balance: number;

  /**
   * The total amount of funds that the
   * common has raised to date in cents
   */
  raised: number;

  /**
   *  The timestamp after witch you are able to
   *  create funding proposals
   */
  fundingGoalDeadline: number;

  /**
   * List of all users, that are members of this common
   */
  members: ICommonMember[];

  /**
   * List of the rules, that a member must agree
   * to be a part if the common
   */
  rules: ICommonRule[];

  /**
   * List of links, that the common provided
   */
  links: ICommonLink[];

  /**
   * The common metadata properties
   */
  metadata: ICommonMetadata;

  /**
   * The whitelisting status of the common
   */
  register: CommonRegister;
}

export interface ICommonMember {
  userId: string;
  joinedAt: Timestamp;
}

export interface ICommonRule {
  /**
   * The title for the rule
   */
  title: string;

  /**
   * The description of the rule
   */
  value: string;
}

export interface ICommonLink {
  /**
   * The title of the link
   */
  title: string;

  /**
   * The address, to which the link is pointing
   */
  value: string;
}

export interface ICommonMetadata {
  byline: string;
  description: string;

  /**
   * The id of the user, who created the common
   */
  founderId: string;

  /**
   * The minimum amount in cents, required
   * to join the common
   */
  minFeeToJoin: number;

  /**
   * Whether the user should be charged every
   * month, that they are member of the common,
   * or only when they join
   */
  contributionType: ContributionType;
}

export interface ICommonUpdate {
  /**
   * The new common entity 
   */
  newCommon: ICommonEntity,

  /**
   * The userId of the user who is responsible for the change
   */
  changedBy: string
}

export type ContributionType = 'one-time' | 'monthly';

/**
 * Used to showcase whether the common is whitelisted
 *
 * na - The common is not whitelisted and thus visible only to members
 * registered - The common is whitelisted and part of the featured list
 */
export type CommonRegister = 'na' | 'registered';