import axios from 'axios';

import { externalRequestExecutor } from '../../util';
import { circlePayApi } from '../../settings';
import { ErrorCodes } from '../../constants';

import { ICircleGetBankAccountResponse } from '../cards/circleTypes';
import { getCircleHeaders } from '../index';

export const getBankAccountFromCircle = async (bankAccountId: string): Promise<ICircleGetBankAccountResponse> => {
  const headers = await getCircleHeaders();

  return  await externalRequestExecutor<ICircleGetBankAccountResponse>(async () => {
    return (await axios.get<ICircleGetBankAccountResponse>(`${circlePayApi}/banks/wires/${bankAccountId}`,
      headers
    )).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Cannot get the bank account'
  });
}