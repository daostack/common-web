import axios from 'axios';
import * as yup from 'yup';
import * as iban from 'ibantools';

import { v4 } from 'uuid';
import { billingDetailsValidationSchema } from '../../../util/schemas';
import { validate } from '../../../util/validate';
import { IBankAccountEntity } from '../types';
import { getCircleHeaders } from '../../index';
import { ICircleCreateBankAccountPayload, ICircleCreateBankAccountResponse } from '../../cards/circleTypes';
import { externalRequestExecutor } from '../../../util';
import { circlePayApi } from '../../../settings';
import { ErrorCodes } from '../../../constants';
import { bankAccountDb } from '../database';

const bankAccountValidationSchema = yup.object({
  iban: yup
    .string()
    .required()
    .test({
      name: 'Validate IBAN',
      message: 'Please provide valid IBAN',
      test: (value): boolean => {
        return iban.isValidIBAN(value);
      }
    }),

  billingDetails: billingDetailsValidationSchema,
  bankAddress: billingDetailsValidationSchema
});

type CreateBankAccountPayload = yup.InferType<typeof bankAccountValidationSchema>;

const normalizeIban = (iban: string): string => iban.toUpperCase().trim();

export const createBankAccount = async (payload: CreateBankAccountPayload): Promise<IBankAccountEntity> => {
  // Validate the provided data
  await validate(payload, bankAccountValidationSchema);

  // Format the data for circle
  const headers = await getCircleHeaders();
  const data: ICircleCreateBankAccountPayload = {
    idempotencyKey: v4(),
    iban: normalizeIban(payload.iban),

    billingDetails: payload.billingDetails as any,
    bankAddress: {
      ...payload.bankAddress as any,
      bankName: payload.bankAddress.name
    },
  }

  // Create the account on Circle
  const { data: response } = await externalRequestExecutor<ICircleCreateBankAccountResponse>(async () => {
    return (await axios.post<ICircleCreateBankAccountResponse>(`${circlePayApi}/banks/wires`,
      data,
      headers
    )).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Cannot create the bank account, because it was rejected by Circle'
  });

  // Check if the account exists
  const existingBankAccounts = await bankAccountDb.getMany({
    fingerprint: response.fingerprint
  });

  // If there is entity for that bank account just return it
  if (existingBankAccounts.length) {
    return existingBankAccounts[0];
  }

  // If there are no entities for this account - create it
  const bankAccount = await bankAccountDb.add({
    circleId: response.id,
    circleFingerprint: response.fingerprint,

    bank: response.bankAddress as any,
    billingDetails: response.billingDetails as any
  });

  // @todo Create event

  // Return the created bank account
  return bankAccount;
};