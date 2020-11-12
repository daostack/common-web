import { ICommonEntity } from '../../functions/src/common/types';

import { commonApp } from './supertests';
import { getAuthToken } from './auth';

export const createTestCommon = async (userId = 'test-user'): Promise<ICommonEntity> => {
  const payload = {
    "name": "Common Test",
    "image": "https://llandscapes-10674.kxcdn.com/wp-content/uploads/2019/07/lighting.jpg",
    "action": "to do or not to",
    "byline": "basically",
    "description": "hey there, am i descriptive",
    "contributionType": "one-time",
    "contributionAmount": 6500
  };

  const authToken = await getAuthToken(userId);

  const response = await commonApp
    .post('/create')
    .set({
      Authorization: authToken
    })
    .send(payload);

  return response.body;
}