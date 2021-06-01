import { testFlag } from '../../helpers';

const template = `
Hello {{userName}},
<br /><br />
Congratulations!
<br /><br />
Your proposal "{{proposal}}" to "{{commonName}}" has been approved. To send you the funds ({{fundingAmount}}), we first need you to complete some missing information.
<br /><br />
Please include the following details in a return email:
<br /><br />
Street address, town/city, state, country, zip code.
<br /><br />
Once received, we will send you another email with instructions on how to proceed and get the funds.
<br /><br />
For more information you can contact us any time by replying to this email.
<br /><br />
Common Payouts ({{fromEmail}}),
<br /><br />
Collaborative Social Action.
`;

const emailStubs = {
  userName: {
    required: true
  },
  proposal: {
    required: true
  },
  fundingAmount: {
    required: true
  },
  commonName: {
    required: true
  },
  supportChatLink: {
    required: true
  },
  fromEmail: {
    required: true
  },
};

export const userFundingRequestAcceptedUnknown = {
  subject: `${testFlag()} Proposal approved - Missing information`,
  emailStubs,
  template
};
