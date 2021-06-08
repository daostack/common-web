const template = `
Hello {{userName}},
<br /><br />
Congratulations!
<br /><br />
Your proposal "{{proposal}}" to "{{commonName}}" has been approved by the Common.
<br /><br />
For more information you can contact us any time using our  <a href="{{supportChatLink}}">support chat</a>
<br /><br />
Common Team ({{fromEmail}}),
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

export const userFundingRequestAcceptedZeroAmount = {
  subject: 'Your proposal was approved!',
  emailStubs,
  template
};
