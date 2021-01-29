import { IEmailTemplate } from "..";

const template = `
  <div>
    Hello {{firstName}},
    <br /><br />
    There seems to be a problem with processing your monthly contribution to <a href="{{commonLink}}">{{commonName}}</a>. We’ve made two attempts to charge your credit card, but the payment failed. 
    Unfortunately, this means you are no longer a member of the Common. But don’t worry! You can always request to join again!
    Please make sure the payment information you provided is correct and that your credit card isn't limited or blocked, then resubmit your request. 
    For more information you can contact us any time using our <a href="{{supportChatLink}}">support chat</a>
    <br /><br />
    Common,<br/>
    Collaborative Social Action.
  </div>
`

export const subscriptionChargeFailed: IEmailTemplate = {
  subject: 'Payment could not be processed',
  template: template,
  emailStubs: {
    firstName: {
      required: true
    },
    commonLink: {
      required: true
    },
    commonName: {
      required: true
    }
  }
}