import axios from 'axios';

import { externalRequestExecutor } from '../../util';
import { getCircleHeaders } from '../index';
import { circlePayApi } from '../../settings';
import { ErrorCodes } from '../../constants';


interface ICircleAmount {
  amount: string;
  currency: string;
}

interface ICircleBalance {
  data: {
    available: ICircleAmount[];
    unsettled: ICircleAmount[];
  }
}

export const getBalanceFromCircle = async (): Promise<ICircleBalance> => {
  const headers = await getCircleHeaders();

  return externalRequestExecutor<ICircleBalance>(async () => {
    return (await axios.get<ICircleBalance>(`${circlePayApi}/businessAccount/balances`, headers)).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    message: 'Failed getting balance from circle'
  });
}