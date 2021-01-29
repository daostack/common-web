const template = `
    The following payment pre-authorization failed:

 <br /><br /><br />

    Common name: {{commonName}}<br />
    Membership request ID: {{membershipRequestId}}<br />
    User Full Name: {{userFullName}}<br />
    User ID: {{userId}}<br />
    User Email: {{userEmail}}<br />
    Payment amount: {{paymentAmount}}<br />
    Submitted on: {{submittedOn}}<br />
    Failure reason: {{failureReason}}<br />
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
  userEmail: {
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

export const adminPreauthorizationFailed = {
  subject: 'Payment pre-authorization failed',
  emailStubs,
  template
};
