import { ICommonEntity } from '@common/types';

import { commonApp } from './supertests';
import { getTestAuthToken } from './auth';

export const createTestCommon = async (userId = 'test-user', zeroContribution = true): Promise<ICommonEntity> => {
  const payload = {
    name: 'Common Test',
    image: 'https://llandscapes-10674.kxcdn.com/wp-content/uploads/2019/07/lighting.jpg',
    byline: 'basically this is a test common',
    description: 'hey there, am i descriptive',
    contributionType: 'one-time',
    contributionAmount: 6500,
    fundingGoalDeadline: new Date().getTime() / 1000,
    zeroContribution,
  };

  const authToken = await getTestAuthToken(userId);

  const response = await commonApp
    .post('/create')
    .set({
      Authorization: authToken
    })
    .send(payload);

  return response.body;
};