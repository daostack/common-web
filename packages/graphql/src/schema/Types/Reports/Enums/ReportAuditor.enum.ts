import { enumType } from 'nexus';
import { ReportAuditor } from '@prisma/client';

export const ReportAuditorEnum = enumType({
  name: 'ReportAuditor',
  members: ReportAuditor
});