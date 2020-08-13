const template = `
    The following payment pre-authorization failed:

    Common name: {{commonName}}
    Membership request ID: {{membershipRequestId}}
    User Full Name: {{userFullName}}
    User ID: {{userId}}
    User Email: {{userEmail}}
    Payment amount: {{paymentAmount}}
    Submitted on: {{submittedOn}}
    Failure reason: {{failureReason}}
`;

const emailStubs = {
  commonName: {
    required: true
  },
  membershipRequestId: {
    required: true
  },
  userId: {
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
  failureReason: {
    required: true
  }
};

module.exports = {
  subject: 'Payment pre-authorization failed',
  emailStubs,
  template
};
