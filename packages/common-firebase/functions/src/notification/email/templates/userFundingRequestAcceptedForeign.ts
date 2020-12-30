const template = `
Hello {{userName}},
<br /><br />
Congratulations! <br />
Your proposal: {{proposal}} to {{commonName}} has been approved. To receive the funds ({{fundingAmount}}) you will need to provide your bank account details, as well as some identification information.
<br /><br />
Please fill all the required information on the attached form and send it back to us at: payout@common.io
<br /><br />
For more information you can contact us any time using our  <a href="{{supportChatLink}}">support chat</a>
<br /><br />
Common,<br />
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
  }
};

export const userFundingRequestAcceptedForeign = {
  subject: 'Your funding proposal was approved',
  emailStubs,
  template
};
