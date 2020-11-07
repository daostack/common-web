import { IBaseEntity } from '../util/types';
import { ContributionType } from '../common/types';

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

  type: string;

  description: {
    description: string;
  }

  // @todo Votes
}

export type ProposalType = 'fundingRequest' | 'join';

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
  }
}

/**
 * The proposal base type. This is advanced typing that will change the
 * available fields based on the type field (witch can be either joinRequest or fundingRequest)
 */
export type IProposalEntity = IJoinRequestProposal | IFundingRequestProposal;
