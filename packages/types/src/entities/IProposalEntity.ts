import { IBaseEntity } from './helpers/IBaseEntity';

import { ContributionType } from './ICommonEntity';
import { VoteOutcome } from './IVoteEntity';

export type ProposalPaymentState = 'notAttempted' | 'pending' | 'failed' | 'confirmed' | 'notRelevant';

export type FundingRequestState = 'countdown' | 'passed' | 'failed' | 'passedInsufficientBalance';
export type RequestToJoinState = 'countdown' | 'passed' | 'failed';

/**
 * The base proposal fields, that will be available
 * to all proposal regardless of their type
 */
interface IBaseProposalEntity extends IBaseEntity {
  /**
   * The id of the user, who created the proposal
   */
  proposerId: string;

  /**
   * The common for witch the
   * proposal was created
   */
  commonId: string;

  /**
   * The type of the proposal: fundingRequest or join
   */
  type: ProposalType;

  /**
   * Collection with some of the vote information
   * for this proposal
   */
  votes: IProposalVote[];

  /**
   * The current state of the proposal.
   *
   * Countdown - the proposal has not been finalized yet. The voting is ongoing
   * Passed - The voting is ended. The proposal is accepted
   * Failed - The voting is ended. The proposal is rejected
   *
   * If the proposal is of funding type it may have one additional proposal state:
   *
   * PassedInsufficientBalance - The voting has ended and the proposal has been approved,
   *    however there were not enough funds in the common balance at the time of the approval
   *    to fund this proposal
   */
  state: string;

  /**
   * The countdown period in seconds relative to the creation date
   */
  countdownPeriod: number;

  /**
   * This is the period at the end of the voting in which if
   * vote flip occurs the countdown period will be extended
   */
  quietEndingPeriod: number;

  /**
   * The number of votes for the proposal
   */
  votesFor: number;

  /**
   * The number of votes against the proposal
   */
  votesAgainst: number;
}

interface IProposalVote {
  /**
   * The identifier of the vote in the votes
   * collection
   */
  voteId: string;

  /**
   * The id of the user, who voted
   */
  voterId: string;

  /**
   * The outcome of the vote
   */
  voteOutcome: VoteOutcome;
}

interface IProposalDescription {
  /**
   * The proposal description
   */
  description: string;

  /**
   * Array of all links, backing up the proposal
   */
  links: IProposalLink[];
}

export interface IProposalLink {
  /**
   * The title, that the user will see
   */
  title?: string;

  /**
   * The place, where the user will be taken upon click
   */
  value: string;
}

export interface IProposalImage {
  /**
   * The URL of where the image is
   */
  value: string;
}

export interface IProposalFile {
  /**
   * The URL of where the file is
   */
  value: string;
}

/**
 * The extended version of the proposal including
 * the fields for funding requests
 */
export interface IFundingRequestProposal extends IBaseProposalEntity {
  type: 'fundingRequest';

  state: FundingRequestState;

  /**
   * Object with some description of the proposal
   */
  description: IProposalDescription | {
    /**
     * The proposal in short
     */
    title: string;

    /**
     * Collection of images supporting the request
     */
    images: IProposalImage[];

    /**
     * Collection of files supporting the request
     */
    files: IProposalFile[];
  };


  fundingRequest: {
    /**
     * The amount (in US cents) that was requested
     */
    amount: number;

    /**
     * Whether the funds have been send
     * to the requested
     */
    funded: boolean;
  };
}

/**
 * The extended version of the proposal including
 * the fields for join requests
 */
export interface IJoinRequestProposal extends IBaseProposalEntity {
  type: 'join';

  state: RequestToJoinState;

  /**
   * Object with some description of the proposal
   */
  description: IProposalDescription;

  /**
   * The current state of the payment for the proposal
   *
   * notAttempted - the payment is not attempted. Maybe the proposal is not approved?
   * pending - the payment is currently pending
   * failed - the payment was not successful
   * confirmed - the payment was successful
   */
  paymentState: ProposalPaymentState;

  join: {
    /**
     *  The amount that will be contributed
     */
    funding: number;

    /**
     * Whether the contribution will be monthly or one time
     */
    fundingType: ContributionType;

    /**
     * The card that will be charged if the
     * proposal is approved
     */
    cardId: string;

    /**
     * Array of the payment IDs made for this proposal
     */
    payments: string[];
  };
}


export type ProposalType = 'join' | 'fundingRequest';

/**
 * The proposal base type. This is advanced typing that will change the
 * available fields based on the type field (witch can be either joinRequest or fundingRequest)
 */
export type IProposalEntity = IJoinRequestProposal | IFundingRequestProposal;
