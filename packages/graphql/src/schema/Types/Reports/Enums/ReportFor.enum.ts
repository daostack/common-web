import { enumType } from 'nexus';
import { ReportFor } from '@prisma/client';

export const ReportForEnum = enumType({
  name: 'ReportFor',
  members: ReportFor
});