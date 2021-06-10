import * as z from 'zod';
import { allPermissions } from './permissions';

export { LinkSchema } from './schemas/Link.schema';
export { RuleSchema } from './schemas/Rule.schema';
export { BankAccountSchema } from './schemas/BankAccount.schema';
export { ProposalLinkSchema } from './schemas/ProposalLink.schema';
export { ProposalFileSchema } from './schemas/ProposalFile.schema';
export { ProposalImageSchema } from './schemas/ProposalImage.schema';
export { BillingDetailsSchema } from './schemas/BillingDetails.schema';


// That is stupid, but it works
const [permissions, ...rest] = allPermissions;
export const PermissionValidator = z.enum([permissions, ...rest]);