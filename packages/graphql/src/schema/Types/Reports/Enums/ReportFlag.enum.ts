import { enumType } from 'nexus';
import { ReportFlag } from '@prisma/client';

export const ReportFlagEnum = enumType({
  name: 'ReportFlag',
  members: ReportFlag
});