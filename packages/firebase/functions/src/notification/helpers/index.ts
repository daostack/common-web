import { env } from '../../constants';

export const getFundingRequestAcceptedTemplate = (country: string, amount: number): string => {
  if (amount) {
    return !country
      ? 'userFundingRequestAcceptedUnknown'
      : (country === 'IL'
        ? 'userFundingRequestAcceptedIsraeli'
        : 'userFundingRequestAcceptedForeign');
  }
  return 'userFundingRequestAcceptedZeroAmount';
};

//indication the email was sent from staging
export const testFlag = (): string => env.environment === 'staging' || env.environment === 'dev' ? '[TEST] ' : '';
