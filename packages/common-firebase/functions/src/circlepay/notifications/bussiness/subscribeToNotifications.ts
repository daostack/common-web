import axios from 'axios';

import { circlePayApi } from '../../../settings';
import { externalRequestExecutor } from '../../../util';
import { env, ErrorCodes } from '../../../constants';
import { getCircleHeaders } from '../../index';

export const subscribeToNotifications = async (): Promise<void> => {
  const options = await getCircleHeaders();

  const currentSubscriptions = await externalRequestExecutor<{
    data: {
      id: string;
      endpoint: string;
      subscriptionDetails: {
        url: string;
        status: string;
      }[]
    }[];
  }>(async () => {
    return (await axios.get(`${circlePayApi}/notifications/subscriptions`, options)).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Call to CirclePay failed. Please try again later and if the issue persist contact us.'
  });

 let endpoints = [
   env.endpoints.base + env.endpoints.notifications,
 ];

  for (const sub of currentSubscriptions.data) {
    if (endpoints.some(endpoint => endpoint === sub.endpoint)) {
      endpoints = endpoints.filter(endpoint => endpoint === sub.endpoint);
    } else {
      try {
        // eslint-disable-next-line no-await-in-loop
        await unsubscribeFromNotification(sub.id);
      } catch (e) {
        logger.warn(`
          Unable to unsubscribe from ${sub.id} for endpoint ${sub.endpoint}
        `, e);
      }
    }
  }

  if (endpoints.length) {
    for (const endpoint of endpoints) {
      // eslint-disable-next-line no-await-in-loop
      await subscribeEndpoint(endpoint);
    }
  }
};

const unsubscribeFromNotification = async (notificationId: string): Promise<void> => {
  const options = await getCircleHeaders();

  await externalRequestExecutor(async () => {
    return (await axios.delete(`${circlePayApi}/notifications/${notificationId}`, options));
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Something bad happened while trying to unsubscribe from notification'
  });
};

const subscribeEndpoint = async (endpoint: string): Promise<void> => {
  const options = await getCircleHeaders();

  await externalRequestExecutor(async () => {
    return (await axios.post(`${circlePayApi}/notifications/subscriptions`, {
      endpoint
    }, options));
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Something bad happened while trying to unsubscribe from notification'
  });
};
