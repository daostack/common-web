const template = `
The following proposal was approved but the payment could not be processed.

Common name: {{commonName}}
Common ID: <a href="{{commonLink}}">{{commonId}}</a>
Proposal ID: {{proposalId}}
User Full Name: {{userFullName}}
User ID: {{userId}}
User Email: {{userEmail}}
Payment amount: {{paymentAmount}}
Submitted on: {{submittedOn}}

Log/info:

{{log}}
`;

const emailStubs = {
  commonId: {
    required: true
  },
  commonLink: {
    required: true
  },
  commonName: {
    required: true
  },
  proposalId: {
    required: true
  },
  userFullName: {
    required: true
  },
  paymentAmount: {
    required: true
  },
  submittedOn: {
    required: true
  },
  log: {
    required: true
  }
};

module.exports = {
  subject: 'Payment could not be processed',
  emailStubs,
  template
};
