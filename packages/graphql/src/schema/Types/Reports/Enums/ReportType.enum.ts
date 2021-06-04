import { enumType } from 'nexus';
import { ReportType } from '@prisma/client';

export const ReportTypeEnum = enumType({
  name: 'ReportType',
  members: ReportType
});