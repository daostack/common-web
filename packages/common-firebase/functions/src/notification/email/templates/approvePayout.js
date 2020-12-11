const template = `
 You can approve payout {{payoutId}} for {{amount}} by clicking <a href="{{url}}">here</a>
`;

const emailStubs = {
  payoutId: {
    required: true
  },
  amount: {
    required: true
  },
  url: {
    required: true
  }
};

module.exports = {
  subject: 'Approve payout',
  emailStubs,
  template
};
