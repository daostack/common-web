import * as z from 'zod';
import { allPermissions } from './permissions';

export { ProposalLinkSchema } from './schemas/ProposalLink.schema';
export { LinkSchema } from './schemas/Link.schema';
export { BillingDetailsSchema } from './schemas/BillingDetails.schema';
export { ProposalImageSchema } from './schemas/ProposalImage.schema';
export { ProposalFileSchema } from './schemas/ProposalFile.schema';

export const PermissionValidator = z.enum(allPermissions as any);