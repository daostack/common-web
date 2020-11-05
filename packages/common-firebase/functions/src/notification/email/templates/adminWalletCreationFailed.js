const template = `
Failed to create mangopayId or walletId for DAO: {{commonName}} with id: {{commonId}}
`;

const emailStubs = {
  commonId: {
    required: true
  },
  commonName: {
    required: true
  }
};

module.exports = {
  subject: 'Failed to create mangopayId or walletId',
  emailStubs,
  template
};
