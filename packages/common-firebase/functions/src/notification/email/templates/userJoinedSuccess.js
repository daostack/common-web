const template = `
Hello {{userName}},
<br /><br />
Congratulations,<br />
Your request to join <a href="{{commonLink}}">{{commonName}}</a> has been approved. You are now an equal member. You can join the discussion, vote, and submit proposals to the common.
<br /><br />
For more information you can contact us any time using our <a href="{{supportChatLink}}">support chat</a>
<br /><br />
Common,<br />
Collaborative Social Action.
`;

const emailStubs = {
  userName: {
    required: true
  },
  commonLink: {
    required: true
  },
  commonName: {
    required: true
  },
  supportChatLink: {
    required: true
  }
};

module.exports = {
  subject: 'You are in! ',
  emailStubs,
  template
};
