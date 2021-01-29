import { IEmailTemplate } from '..';

const template = `
  <div>
    <p>
        Hello {{firstName}},<br />
        Your proposal in {{commonName}} was accepted by the Common, but the Common balance was lower than the amount requested.
    </p>
    
    <p>Since you created the proposal, other proposals were accepted, and the balance changed.</p>
    
    <br />
    
    <p>The proposal was canceled, but you can always create another!</p>
    
    <dl>
      <dt>Proposal name: {{proposalName}}</dt>
      <dt>Amount requested: {{amountRequested}}</dt>
      <dt>Current balance: {{commonBalance}}</dt>
    </dl>
    
    <p>For more information you can contact us any time using our <a href="{{supportChatLink}}">support chat</a>.</p>
    
    <p>
      Common,<br />
      Collaborative Social Action.
      </p>
  </div>
`;

export const userFundingRequestAcceptedInsufficientFunds: IEmailTemplate = {
  subject: 'Your proposal was canceled due to insufficient funds',
  template: template,
  emailStubs: {
    firstName: {
      required: true
    },
    commonName: {
      required: true
    },
    proposalName: {
      required: true
    },
    amountRequested: {
      required: true
    },
    commonBalance: {
      required: true
    }
  }
};