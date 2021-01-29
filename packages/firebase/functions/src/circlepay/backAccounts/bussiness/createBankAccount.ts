import axios from 'axios';
import * as yup from 'yup';
import * as iban from 'ibantools';

import { v4 } from 'uuid';
import {
  billingDetailsValidationSchema,
  bankAccountValidationSchema as bankAccountValidationExternalSchema
} from '../../../util/schemas';
import { validate } from '../../../util/validate';
import { IBankAccountEntity } from '../types';
import { getCircleHeaders } from '../../index';
import { ICircleCreateBankAccountPayload, ICircleCreateBankAccountResponse } from '../../cards/circleTypes';
import { externalRequestExecutor, isNullOrUndefined } from '../../../util';
import { circlePayApi } from '../../../settings';
import { ErrorCodes } from '../../../constants';
import { bankAccountDb } from '../database';

const bankAccountValidationSchema = yup.object({
  iban: yup
    .string()
    // This is workaround the cyclic dependency
    //
    // iban -> accountNumber, but not accountNumber -> iban
    // routingNumber -> iban, but not iban -> routingNumber
    .when('accountNumber', {
      is: (accountNumber) => isNullOrUndefined(accountNumber),
      then: yup
        .string()
        .required('The IBAN is required field when there are not account number and routing number provided'),
      otherwise: yup
        .string()
        .test({
          test: (value) => isNullOrUndefined(value),
          message: 'Cannot have both account number and IBAN'
        })
    })
    .test({
      name: 'Validate IBAN',
      message: 'Please provide valid IBAN',
      test: (value): boolean => {
        return isNullOrUndefined(value) ||
          iban.isValidIBAN(value);
      }
    }),

  accountNumber: yup.string()
    .when('billingDetails.country', {
      is: (country: string) => country?.toLowerCase() === 'us',
      then: yup
        .string()
        .required('The account number is required for US transfers.')
    }),

  routingNumber: yup.string()
    .when('iban', {
      is: (iban: string) => isNullOrUndefined(iban),
      then: yup
        .string()
        .required('The routing number is required when the IBAN is not provided')
    })
    .when('billingDetails.country', {
      is: (country: string) => country?.toLowerCase() === 'us',
      then: yup
        .string()
        .required('The routing number is required for US transfers.')
    }),

  billingDetails: billingDetailsValidationSchema,
  bankAddress: bankAccountValidationExternalSchema
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

    ...(payload.iban ? {
      iban: normalizeIban(payload.iban),
    } : {
      routingNumber: payload.routingNumber,
      accountNumber: payload.accountNumber
    }),

    billingDetails: payload.billingDetails as any,
    bankAddress: {
      ...payload.bankAddress as any,
      bankName: payload.bankAddress.name
    }
  };

  // Create the account on Circle
  const { data: response } = await externalRequestExecutor<ICircleCreateBankAccountResponse>(async () => {
    logger.debug('Trying to create new bank account with circle', {
      data
    });

    return (await axios.post<ICircleCreateBankAccountResponse>(`${circlePayApi}/banks/wires`,
      data,
      headers
    )).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Cannot create the bank account, because it was rejected by Circle'
  });

  // Check if the account exists
  const existingBankAccount = await bankAccountDb.get(response?.id, false);
  
  if(existingBankAccount) {
    return existingBankAccount;
  }

  // If there are no entities for this account - create it
  const bankAccount = await bankAccountDb.add({
    circleId: response.id,
    circleFingerprint: response.fingerprint,

    description: response.description,

    bank: response.bankAddress as any,
    billingDetails: response.billingDetails as any
  });

  // @todo Create event

  // Return the created bank account
  return bankAccount;
};