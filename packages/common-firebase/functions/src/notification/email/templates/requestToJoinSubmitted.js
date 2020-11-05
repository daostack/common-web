const template = `
  Hello {{name}},<br />
  Thank you for Joining Common!
  <br /><br />
  Your request to join <a href="{{link}}">{{commonName}}</a> has been submitted and is pending approval by the Common members. 
  You will be notified by email once voting has concluded. 
  <br /><br />
  For more information you can contact us any time using our <a href="{{supportChatLink}}">support chat</a>
  <br />
  Common,<br />
  Collaborative Social Action.
`;

const emailStubs = {
  name: {
    required: true
  },
  link: {
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
  subject: 'Request to join submitted',
  emailStubs,
  template
};
