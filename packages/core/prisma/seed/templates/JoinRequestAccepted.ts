import { SeedableTemplate } from '../notificationTemplates';

const content = `
<div>
  Hello {{user.firstName}} {{user.lastName}},
  <br /><br />
  Congratulations,<br />
  Your request to join <a href="https://app.common.io/common/{{common.id}}">{{common.name}}</a> has been approved. You are now an equal member. You can join the discussion, vote, and submit proposals to the common.
  <br /><br />
  For more information you can contact us any time using our <a href="{{default.supportChatLink}}">support chat</a>
  <br /><br />
  Common,<br />
  Collaborative Social Action.
</div>
`;

export const JoinRequestAcceptedTemplateEnglish: SeedableTemplate = {
  subject: 'You are in!',
  content
};

export const JoinRequestAcceptedTemplate = {
  EN: JoinRequestAcceptedTemplateEnglish
};