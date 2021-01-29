const template = `
Hello {{userName}},<br />
Thank you for Joining Common!
<br /><br />
Your request to join <a href="{{commonLink}}">{{commonName}}</a> has been approved by the common but there seems to be a problem with processing your payment. 
<br /><br />
Please make sure the payment information you provided is correct and that your credit card isn't limited or blocked, then resubmit your request. 
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

export const userJoinedButFailedPayment = {
  subject: 'Payment could not be processed',
  emailStubs,
  template
};
