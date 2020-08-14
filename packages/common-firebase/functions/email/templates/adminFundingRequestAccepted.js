const template = `
Notice to Admin<br />
The following proposal was approved and is awaiting payment.
<br /><br /><br />
Common name: {{commonName}}<br />
Common id: <a href="{{commonLink}}">{{commmonId}}</a><br />
Common balance: {{commonBalance}}<br />
Proposal ID: {{proposalId}}<br />
User Full Name: {{userFullName}}<br />
User ID: {{userId}}<br />
User Email: {{userEmail}}<br />
Payment Id: {{paymentId}}<br />
Payment amount: {{paymentAmount}}<br />
Submitted on: {{submittedOn}}<br />
Passed on: {{passedOn}}<br />
<br /><br />
Log/info:
<br /><br />

{{log}}

`;

const emailStubs = {
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
