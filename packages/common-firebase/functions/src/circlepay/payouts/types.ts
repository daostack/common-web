import { IBaseEntity } from '../../util/types';

export type PayoutStatus = 'pending' | 'complete' | 'failed';
export type PayoutType = 'independent' | 'proposal';

interface IPayoutBaseEntity extends IBaseEntity {
  /**
   * Whether the payout was created for proposal, or
   * is independent of that
   */
  type: PayoutType;

  /**
   * The destination of the payment
   */
  destination: IPayoutDestination;

  /**
   * The amount of the payout in US dollar cents
   */
  amount: number;

  security: IPayoutSecurity[];

  /**
   * Whether the payout has been send to circle for execution
   */
  executed: boolean;

  /**
   * Whether the payout has been voided
   */
  voided: boolean;
}

interface IExecutedPayout extends IPayoutBaseEntity {
  executed: true;

  /**
   * This is the id of the payout on circle side. Cam
   * be useful for updating payout status
   */
  circlePayoutId: string;

  /**
   * The current status of the payout
   */
  status: PayoutStatus;
}

interface IUnexecutedPayout extends IPayoutBaseEntity {
  executed: false;
}

type IExecutablePayoutEntity = IUnexecutedPayout | IExecutedPayout;


/**
 * Security details about the payout, needed for the
 * execution of it
 */
export interface IPayoutSecurity {
  /**
   * The ID of the token (no unique globally, but unique in the payout scope)
   */
  id: number;

  /**
   * The token itself
   */
  token: string;

  /**
   * Whether the token has been redeemed successfully
   */
  redeemed: boolean;

  /**
   * How many times an unsuccessful redemption was made
   */
  redemptionAttempts: number;
}

/**
 * Details about the destination
 * of the payout
 */
export interface IPayoutDestination {
  /**
   * The ID of the destination in
   * the firebase
   */
  id: string;

  /**
   * The ID of the destination on
   * circle's side
   */
  circleId: string;
}

type IProposalPayoutEntity = IExecutablePayoutEntity & {
  type: 'proposal'

  /**
   * The ID of the proposal, for witch the payout
   * is made
   */
  proposalId: string;
}

type IIndependentPayoutEntity = IExecutablePayoutEntity;

export type IPayoutEntity = IProposalPayoutEntity | IIndependentPayoutEntity;