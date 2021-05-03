const template = `
<div>
  Hello stranger,
  <br /><br />
  New payout was requested with the following parameters:
  <br /> <hr /> <br />
  
  Beneficiary: <b>{{beneficiary}}</b> <br />
  Proposal: <b>{{proposal}}</b>  <br />
  Common: <b>{{common}}</b>  <br />
  
  <br /> <br /> <br />
  Bank Account Details:  
  <br /> <hr /> <br />
  <span style="margin-right: 10px">Bank: <b>{{bank}}</b></span> <br />
  <span style="margin-right: 10px">Description: <b>{{bankDescription}}</b></span> <br />
  
  <br /><br />
  You can approve payout {{payoutId}} for {{amount}} by clicking <a href="{{url}}">here</a> to approve immediately or
   <a href="{{adminUrl}}">here</a> for more options.
  <br /><br />
  Have a nice day,
  <br>
  Common Payouts ({{fromEmail}})
</div>
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
  },
  adminUrl: {
    required: true
  },
  beneficiary: {
    required: true
  },
  proposal: {
    required: true
  },
  common: {
    required: true
  },
  bankDescription: {
    required: true
  },
  bank: {
    required: true
  },
  fromEmail: {
    required: true
  },
};

export const approvePayout = {
  subject: 'Approve payout',
  emailStubs,
  template
};
