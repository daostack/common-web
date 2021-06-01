import { testFlag } from '../../helpers';

const template = `
The following proposal was approved but the payment could not be processed.

Common name: {{commonName}}
Common ID: <a href="{{commonLink}}">{{commonId}}</a>
Proposal ID: {{proposalId}}
User Full Name: {{userName}}
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
  userName: {
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

export const adminJoinedButPaymentFailed = {
  subject: `${testFlag()} Payment could not be processed`,
  emailStubs,
  template
};
