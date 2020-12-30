const template = `
Hello {{userName}},
<br /><br />
Congratulations! <br />
Your proposal: {{proposal}} to {{commonName}} has been approved.
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
  commonName: {
    required: true
  },
  supportChatLink: {
    required: true
  }
};

export const userFundingRequestAcceptedZeroAmount = {
  subject: 'Your funding proposal was approved',
  emailStubs,
  template
};
