const template = `
Hello {{userName}},
<br /><br />
Congratulations! <br />
Your new Common: {{commonName}}, is all set up. You can share it with friends via this direct link:

<br /><br />
<a href="{{commonLink}}">{{commonLink}}</a>
<br /><br />

This Common is visible to you and anyone you share it with. Inspiring or highly active Commons will be featured, and publicly visible on the app’s home screen.
<br />
For more information you can contact us any time using our  <a href="{{supportChatLink}}">support chat</a>
<br />
Common,
<br />
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
  subject: 'Common successfully created',
  emailStubs,
  template
};
