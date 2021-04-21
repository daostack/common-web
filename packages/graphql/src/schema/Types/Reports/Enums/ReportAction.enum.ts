import { enumType } from 'nexus';
import { ReportAction } from '@prisma/client';

export const ReportActionEnum = enumType({
  name: 'ReportAction',
  members: ReportAction
});