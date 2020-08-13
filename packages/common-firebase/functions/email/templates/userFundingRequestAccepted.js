const template = `
Hello {{name}},

Congratulations! 
Your proposal: {{proposal}} has been approved. To receive the funds you will need to provide your bank account details, as well as some identification information.

Please fill all the required information on the attached form and send it back to us at: payout@common.io

For more information you can contact us any time using our  <a href="{{supportChatLink}}">support chat</a>

Common,
Collaborative Social Action.


`;

const emailStubs = {
  name: {
    required: true
  },
  proposal: {
    required: true
  },
  supportChatLink: {
    required: true
  }
};

module.exports = {
  subject: 'Your funding proposal was approved',
  emailStubs,
  template
};
