const template = `
  Pay-In successful for Proposal with ID {{proposalId}}
`;

const emailStubs = {
  proposalId: {
    required: true
  }
};

module.exports = {
  subject: 'Successful pay-in',
  emailStubs,
  template
};
