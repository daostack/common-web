const template = `
Hello {{name}},
Thank you for Joining Common!

Your request to join <a href="{{commonLink}}">{{commonName}}</a> has been approved by the common but there seems to be a problem with processing your payment. 

Please make sure the payment information you provided is correct and that your credit card isn't limited or blocked, then resubmit your request. 

For more information you can contact us any time using our  <a href="{{supportChatLink}}">support chat</a>

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
