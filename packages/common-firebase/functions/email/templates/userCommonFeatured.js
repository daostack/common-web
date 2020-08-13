const template = `
Hello {{name}},
<br />
The Common you created: {{commonName}}, was selected to appear on the app’s “discover” section. Log in to find it there, and feel free to share the news with your fellow members.

<a href="{{commonLink}}">{{commonLink}}</a>

For more information you can contact us any time using our <a href="{{supportChatLink}}">support chat</a>

Common,
Collaborative Social Action.
`;

const emailStubs = {
  name: {
    required: true
  },
  commonName: {
    required: true
  },
  commonLink: {
    required: true
  },
  supportChatLink: {
    required: true
  }
};

module.exports = {
  subject: 'Your Common is now featured ',
  emailStubs,
  template
};
