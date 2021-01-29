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