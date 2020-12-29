const template = `
  Notice to Admin
  
  <br />
  New common created and pending approval.
  
  <br /><br />
  
  <a href="{{commonLink}}">{{commonLink}}</a>
  
  <br /><br />
  
  User Full Name: {{userName}} <br />
  User ID: {{userId}} <br />
  User Email: {{userEmail}} <br />
  Created on: {{commonCreatedOn}} <br />
  Log/info:
  
  <br /><br />
  {{log}}
  <br /><br />
  
  Common Id: {{commonId}}<br />
  Common name: {{commonName}}<br />
  Tagline: {{tagline}}<br />
  About: {{about}}<br />
  Payment type: {{paymentType}}<br />
  Min. contribution: {{minContribution}}<br />
`;

const emailStubs = {
  commonLink: {
    required: true
  },
  userName: {
    required: true
  },
  userId: {
    required: true
  },
  userEmail: {
    required: true
  },
  commonCreatedOn: {
    required: true
  },
  log: {
    required: true
  },
  commonId: {
    required: true
  },
  commonName: {
    required: true
  },
  tagline: {
    required: true
  },
  about: {
    required: true
  },
  paymentType: {
    required: true
  },
  minContribution: {
    required: true
  }
};

export const adminCommonCreated = {
  subject: 'New Common pending approval',
  emailStubs,
  template
};
