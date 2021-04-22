import * as z from 'zod';

export { ProposalLinkSchema } from './schemas/ProposalLink.schema';
export { BillingDetailsSchema } from './schemas/BillingDetails.schema';
export { ProposalImageSchema } from './schemas/ProposalImage.schema';
export { ProposalFileSchema } from './schemas/ProposalFile.schema';

export const PermissionValidator = z.enum([
  'admin.report.read',
  'admin.report.act'
]);