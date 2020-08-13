const template = `
Hello {{name}},

Congratulations,
Your request to join <a href="{{commonLink}}">{{commonName}}</a> has been approved. You are now an equal member. You can join the discussion, vote, and submit proposals to the common.

For more information you can contact us any time using our <a href="{{supportChatLink}}">support chat</a>

Common,
Collaborative Social Action.

`;

const emailStubs = {
  name: {
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
  subject: 'Payment could not be processed',
  emailStubs,
  template
};
