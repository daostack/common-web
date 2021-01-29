const template = `
  Pay-In successful for Proposal with ID {{proposalId}}
`;

const emailStubs = {
  proposalId: {
    required: true
  }
};

export const adminPayInSuccess = {
  subject: 'Successful pay-in',
  emailStubs,
  template
};
