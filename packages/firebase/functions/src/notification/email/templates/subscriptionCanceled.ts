import { IEmailTemplate } from '../index';

const template = `
  <div>
    Hello {{firstName}},
    </br>
    </br>
    We received your request to cancel your monthly contribution to <a href="{{commonLink}}">{{commonName}}</a>. 
    You will remain a member in the Common until {{dueDate}} - 30 days after your last contribution.
    <br/><br/>
    You can always request to join the Common again.
    For more information you can contact us any time using our <a href="{{supportChatLink}}">support chat</a>
    </br>
    </br>
    Common,
    </br>
    Collaborative Social Action.
  </div>
`;

export const subscriptionCanceled: IEmailTemplate = {
  subject: 'Your monthly contribution is canceled',
  template: template,
  emailStubs: {
    firstName: {
      required: true
    },
    dueDate: {
      required: true
    },
    commonLink: {
      required: true
    },
    commonName: {
      required: true
    }
  }
};