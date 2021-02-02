import { IPaymentEntity } from '../../circlepay/payments/types';
import { Collections } from '../../constants';
import { IProposalEntity } from '../../proposals/proposalTypes';
import { db } from '../../settings';
import { IUserEntity } from '../../util/types';
import { getCircleBalance } from './getCircleBalance';
import { getCircleBalanceHistorical } from './getCircleBalanceHistorical';
import { getCommonBalance } from './getCommonBalance';
import { getPayout } from './getPayout';
import { getPayin } from './getPayin';
import { addCircleBalance } from './addCircleBalance';
import { IPayoutEntity } from '../../circlepay/payouts/types';
import { ISubscriptionEntity } from '../../subscriptions/types';
import { ICircleBalanceBase } from '../types';
import { ICommonEntity } from '@common/types';


export const SubscriptionsCollection = db.collection(Collections.Subscriptions)
.withConverter<ISubscriptionEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ISubscriptionEntity {
    return snapshot.data() as ISubscriptionEntity;
    },
    toFirestore(object: ISubscriptionEntity | Partial<ISubscriptionEntity>): FirebaseFirestore.DocumentData {
    return object;
    }
});

export const PayoutsCollection = db.collection(Collections.Payouts)
.withConverter<IPayoutEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IPayoutEntity {
    return snapshot.data() as IPayoutEntity;
    },
    toFirestore(object: IPayoutEntity | Partial<IPayoutEntity>): FirebaseFirestore.DocumentData {
    return object;
    }
});

// this is wrong. Why not use the CommonCollection from the common domain?
export const CommonCollection = db.collection(Collections.Commons)
.withConverter<ICommonEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ICommonEntity {
    return snapshot.data() as ICommonEntity;
    },
    toFirestore(object: ICommonEntity | Partial<ICommonEntity>): FirebaseFirestore.DocumentData {
    return object;
    }
});


export const PaymentsCollection = db.collection(Collections.Payments)
  .withConverter<IPaymentEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IPaymentEntity {
      return snapshot.data() as IPaymentEntity;
    },

    toFirestore(object: IPaymentEntity | Partial<IPaymentEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });


export const ProposalsCollection = db.collection(Collections.Proposals)
.withConverter<IProposalEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IProposalEntity {
    return snapshot.data() as IProposalEntity;
    },
    toFirestore(object: IProposalEntity | Partial<IProposalEntity>): FirebaseFirestore.DocumentData {
    return object;
    }
});

export const UsersCollection = db.collection(Collections.Users)
.withConverter<IUserEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IUserEntity {
    return snapshot.data() as IUserEntity;
    },
    toFirestore(object: IUserEntity | Partial<IUserEntity>): FirebaseFirestore.DocumentData {
    return object;
    }
});

export const CircleBalancesCollection = db.collection(Collections.CircleBalances)
  .withConverter<ICircleBalanceBase>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ICircleBalanceBase {
      return snapshot.data() as ICircleBalanceBase;
    },

    toFirestore(object: ICircleBalanceBase | Partial<ICircleBalanceBase>): FirebaseFirestore.DocumentData {
      return object;
    }
  });


export const backofficeDb = {
    getCircleBalance,
    getCircleBalanceHistorical,
    getCommonBalance,
    getPayout,
    getPayin,
    addCircleBalance
  };