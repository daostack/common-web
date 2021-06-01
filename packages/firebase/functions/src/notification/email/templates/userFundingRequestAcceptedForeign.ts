import { testFlag } from '../../helpers';

const template = `
Hello {{userName}},
<br /><br />
Congratulations!
<br /><br />
Your proposal "{{proposal}}" to "{{commonName}}" has been approved. To receive the funds ({{fundingAmount}}) you will need to provide your bank account details, as well as some identification information.
<br /><br />
We will reach out soon with further instructions on how to submit those details.
<br /><br />
When submitted we will be able to initiate the transaction. It may take up to 10 days for the funds to be transfered.
<br /><br />
Please note that funds are sent via an international bank wire. Your bank might charge fees for receipt of wires, currency conversion or other applicable fees. Due to those fees, the amount you’ll receive may be lower than the original requested amount.
<br /><br />
To ensure transparency, after receiving the funds and paying for the proposed products or services, you will be required to submit Invoices and/or receipts for the payments made.
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
    require: true
  },

};

export const userFundingRequestAcceptedForeign = {
  subject: `${testFlag()} Your funding proposal was approved`,
  emailStubs,
  template
};
