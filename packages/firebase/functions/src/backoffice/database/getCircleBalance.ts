import axios from 'axios';

import { ICircleBalancePayload } from '../types';
import { circlePayApi } from '../../settings';
import { externalRequestExecutor } from '../../util';
import { ErrorCodes } from '../../constants';
import { getCircleHeaders } from '../../circlepay/index';


export const getCircleBalance = async() : Promise<any> => {
  const headers = await getCircleHeaders();

  return await externalRequestExecutor(async () => {
    return await axios.get<ICircleBalancePayload>(`${circlePayApi}/balances`, headers)
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Call to CirclePay failed. Please try again later and if the issue persist contact us.'
  });
}
  