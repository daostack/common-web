import { ISubscriptionEntity } from '@common/types';

jest.mock('../../../../../subscriptions/database/updateSubscription', () => ({
  updateSubscription: jest.fn()
    .mockImplementation((subscription: ISubscriptionEntity): Promise<ISubscriptionEntity> => Promise.resolve(subscription))
}));