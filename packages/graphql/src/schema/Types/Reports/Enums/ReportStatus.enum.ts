import { enumType } from 'nexus';
import { ReportStatus } from '@prisma/client';

export const ReportStatusEnum = enumType({
  name: 'ReportStatus',
  members: ReportStatus
});