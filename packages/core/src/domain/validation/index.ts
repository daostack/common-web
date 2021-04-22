import * as z from 'zod';

export { ProposalLinkSchema } from './schemas/ProposalLink.schema';
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

  'user.permissions.read'
]);