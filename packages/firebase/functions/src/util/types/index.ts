import admin from 'firebase-admin';

import Timestamp = admin.firestore.Timestamp;
import { IEventEntity } from '../../event/type';
import { EventContext } from 'firebase-functions/lib/cloud-functions';

export type valueOf<T> = T[keyof T];
export type Nullable<T> = T | null | undefined;
export type Promisable<T> = T | Promise<T>;

export type CirclePaymentStatus = 'pending' | 'confirmed' | 'paid' | 'failed';

// @todo Fix
export interface IUserEntity {
  id: string;

  email: string;
}

export interface IPaymentSource {
  id: string;
  type: string;
}

export interface IPaymentAmount {
  amount: string;
  currency: string;
}

export interface IPaymentRefund {
  id: string;
  type: 'payment' | string;
  amount: IPaymentAmount;
  status: CirclePaymentStatus;
}


export interface ICircleNotification {
  clientId: string;
  notificationType: 'payments' | string;

  payment: {
    id: string;
    merchantId: string;
    merchantWalletId: string;

    status: CirclePaymentStatus;

    amount: IPaymentAmount;
    source: IPaymentSource;

    createDate: Date;
    updateDate: Date;

    refunds: IPaymentRefund[];
  }
}

export type BaseEntityType = 'id' | 'createdAt' | 'updatedAt';

export type SharedOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export interface IBaseEntity {
  /**
   * The main identifier of the common
   */
  id: string;

  /**
   * The time that the entity
   * was created
   */
  createdAt: Timestamp;

  /**
   * The last time that the entity
   * was modified
   */
  updatedAt: Timestamp;
}

/**
 * This is just generic trigger function
 *
 * @param eventObj - The object containing the event details
 * @param context - Context about the currently executing trigger
 */
export type IEventTrigger = (eventObj: IEventEntity, context: EventContext) => void | Promise<void>