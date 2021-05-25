import * as z from 'zod';
import { allPermissions } from './permissions';

export { LinkSchema } from './schemas/Link.schema';
export { RuleSchema } from './schemas/Rule.schema';
export { ProposalLinkSchema } from './schemas/ProposalLink.schema';
export { BillingDetailsSchema } from './schemas/BillingDetails.schema';
export { ProposalImageSchema } from './schemas/ProposalImage.schema';
export { ProposalFileSchema } from './schemas/ProposalFile.schema';


// That is stupid, but it works
const [permissions, ...rest] = allPermissions;
export const PermissionValidator = z.enum([permissions, ...rest]);