import * as z from 'zod';

export { ProposalLinkSchema } from './schemas/ProposalLink.schema';
export { LinkSchema } from './schemas/Link.schema';
export { BillingDetailsSchema } from './schemas/BillingDetails.schema';
export { ProposalImageSchema } from './schemas/ProposalImage.schema';
export { ProposalFileSchema } from './schemas/ProposalFile.schema';

export const PermissionValidator = z.enum([
  'admin.report.read',
  'admin.report.act',

  'admin.roles.read',
  'admin.roles.create',
  'admin.roles.update',

  'admin.roles.permissions.add',
  'admin.roles.permissions.remove',

  'admin.roles.assign',
  'admin.roles.unassign',

  'admin.events.read',

  'admin.proposals.read',
  'admin.proposals.read.ipAddress',

  'admin.commons.update',
  'admin.commons.delist',
  'admin.commons.whitelist',

  'admin.notification.read',

  'admin.notification.setting.event.create',
  'admin.notification.setting.event.read',
  'admin.notification.setting.event.update',
  'admin.notification.setting.event.delete',

  'admin.notification.setting.create',
  'admin.notification.setting.read',
  'admin.notification.setting.update',
  'admin.notification.setting.delete',

  'admin.notification.setting.template.create',
  'admin.notification.setting.template.read',
  'admin.notification.setting.template.update',
  'admin.notification.setting.template.delete',

  'user.permissions.read'
]);