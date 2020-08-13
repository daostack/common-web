const template = `
Notice to Admin
The following proposal was approved and is awaiting payment.

Common name: {{commonName}}
Common id: <a href="{{commonLink}}">{{commmonId}}</a>
Common balance: {{commonBalance}}
Proposal ID: {{proposalId}}
User Full Name: {{userFullName}}
User ID: {{userId}}
User Email: {{userEmail}}
Payment Id: {{paymentId}}
Payment amount: {{paymentAmount}}
Submitted on: {{submittedOn}}
Passed on: {{passedOn}}

Log/info:

{{log}}

`;

const emailStubs = {
  name: {
    required: true
  },
  commonName: {
    required: true
  },
  commonLink: {
    required: true
  },
  commonId: {
    required: true
  },
  userFullName: {
    required: true
  },
  userId: {
    required: true
  },
  paymentAmount: {
    required: true
  },
  submittedOn: {
    required: true
  },
  passedOn: {
    require: true
  },
  log: {
    require: true
  }
};

module.exports = {
  subject: 'Your funding proposal was approved',
  emailStubs,
  template
};
