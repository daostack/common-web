import { IBaseEntity } from '../util/types';
import { ContributionType } from '../common/types';
import { VoteOutcome } from './voteTypes';

export type ProposalState = 'countdown' | 'passed' | 'failed';

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
   * Object with some description of the proposal
   */
  description: {
    /**
     * The proposal in short
     */
    title: string;

    /**
     * The proposal description
     */
    description: string;

    /**
     * Array of all links, backing up the proposal
     */
    links: IProposalLink[];

    /**
     * Array of all files, backing up the proposal
     */
    files: IProposalFile[];
  }

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
   */
  state: ProposalState;

  /**
   * The countdown period in seconds relative to the creation date
   */
  countdownPeriod: number;

  /**
   * @todo No idea what that is. Find out :D
   */
  quietEndingPeriod: number;
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

export interface IProposalLink {
  /**
   * The title, that the user will see
   */
  title?: string;

  /**
   * The place, where the user will be taken upon click
   */
  address: string;
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
  }
}

/**
 * The extended version of the proposal including
 * the fields for join requests
 */
export interface IJoinRequestProposal extends IBaseProposalEntity{
  type: 'join';

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
     * The ID of the payment if the payment is made
     */
    paymentId?: string;
  }
}


export type ProposalType = 'join' | 'fundingRequest';

/**
 * The proposal base type. This is advanced typing that will change the
 * available fields based on the type field (witch can be either joinRequest or fundingRequest)
 */
export type IProposalEntity = IJoinRequestProposal | IFundingRequestProposal;
