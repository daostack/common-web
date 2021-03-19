const template = `
  Notice to Admin
  
  <br /><br />
  A {{contentType}} was reported:
  
  Reporter username: {{userName}} <br />
  Reporter id: {{userId}} <br />
  Reporter Email: {{userEmail}} <br />
  
  Common Id: {{commonId}}<br />
  Common name: {{commonName}}<br />

  <br /><br />
  
  <a href="{{commonLink}}">{{commonLink}}</a>
  
  <br /><br />
`;

const emailStubs = {
  contentType: {
    required: true
  },
  commonId: {
    required: true
  },
  commonName: {
    required: true
  },
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
};

export const adminContentReported = {
  subject: 'Content reported',
  emailStubs,
  template
};
