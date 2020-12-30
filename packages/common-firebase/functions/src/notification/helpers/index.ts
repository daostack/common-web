export const getFundingRequestAcceptedTemplate = (country: string, amount: number) => {
  if (amount) {
    return !country
      ? 'userFundingRequestAcceptedUnknown'
      : (country === 'IL'
        ? 'userFundingRequestAcceptedIsraeli'
        : 'userFundingRequestAcceptedForeign');
  }
  return 'userFundingRequestAcceptedZeroAmount';
};