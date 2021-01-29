import { IEmailTemplate } from '../index';
import moment from 'moment';

const template = `
  <div>
    Hello {{firstName}},
    <br/><br/>
    Thank you for being part of Common!<br/>
    This is a payment confirmation for your monthly contribution to <a href="{{commonLink}}">{{commonName}}</a>. 
    <br/><br/>
    Your card ending with {{lastDigits}} was charged at {{chargeDate}} for {{chargeAmount}}.
    <br/><br/>
    For more information you can contact us any time using our <a href="{{supportChatLink}}">support chat</a>
    <br/><br/>
    Common,<br/>
    Collaborative Social Action.
  </div>
`;


export const subscriptionCharged: IEmailTemplate = {
  subject: 'Payment confirmation - your monthly contribution to {{commonName}}',
  template: template,

  subjectStubs: {
    commonName: {
      required: true
    }
  },

  emailStubs: {
    firstName: {
      required: true
    },
    commonLink: {
      required: true
    },
    commonName: {
      required: true
    },
    lastDigits: {
      required: true
    },
    chargeDate: {
      required: false,
      default: moment(new Date()).format('MMMM D, YYYY')
    },
    chargeAmount: {
      required: true
    },
    supportChatLink: {
      required: true
    }
  }
};