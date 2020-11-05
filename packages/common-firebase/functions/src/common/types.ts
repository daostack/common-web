export interface ICommonEntity {
  /**
   * The main identitfier of the common
   */
  id: string;

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
   * List of all users, that are members of this common
   */
  members: ICommonMember[];

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
}

export interface ICommonMetadata {
  action: string;
  byline: string;
  description: string;

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

export type ContributionType = 'one-time' | 'monthly';

/**
 * Used to showcase whether the common is whitelisted
 *
 * na - The common is not whitelisted and thus visible only to members
 * registered - The common is whitelisted and part of the featured list
 */
export type CommonRegister = 'na' | 'registered';