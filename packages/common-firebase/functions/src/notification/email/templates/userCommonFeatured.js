const template = `
Hello {{userName}},
<br />
The Common you created: {{commonName}}, was selected to appear on the app’s “discover” section. Log in to find it there, and feel free to share the news with your fellow members.
<br /><br />
<a href="{{commonLink}}">{{commonLink}}</a>
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
