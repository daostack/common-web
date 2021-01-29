const template = `
Notice to Admin<br />
The following proposal was approved and is awaiting payment.
<br /><br /><br />
Common name: {{commonName}}<br />
Common id: <a href="{{commonLink}}">{{commonId}}</a><br />
Common balance: {{commonBalance}}<br />
Proposal ID: {{proposalId}}<br />
User Full Name: {{userName}}<br />
User ID: {{userId}}<br />
User Email: {{userEmail}}<br />
Payment amount: {{fundingAmount}}<br />
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
  commonBalance: {
    required: true
  },
  commonId: {
    required: true
  },
  proposalId: {
    required: true
  },
  userName: {
    required: true
  },
  userEmail: {
    required: true
  },
  userId: {
    required: true
  },
  fundingAmount: {
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

export const adminFundingRequestAccepted = {
  subject: 'Funding proposal was approved',
  emailStubs,
  template
};
