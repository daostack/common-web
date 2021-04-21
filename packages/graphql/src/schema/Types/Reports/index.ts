import { ReportType } from './Types/Report.type';

import { ReportForEnum } from './Enums/ReportFor.enum';
import { ReportStatusEnum } from './Enums/ReportStatus.enum';
import { ReportActionEnum } from './Enums/ReportAction.enum';
import { ReportAuditorEnum } from './Enums/ReportAuditor.enum';

import { ReportWhereInput } from './Inputs/ReportWhere.input';

import { ReportReporterExtension } from './Extensions/ReportReporter.extension';
import { ReportReportedMessageExtension } from './Extensions/ReportReportedMessage.extension';

import {
  ReportDiscussionMessageInput,
  ReportDiscussionMessageMutation
} from './Mutations/ReportDiscussionMessage.mutation';

import { ActOnReportMutation, ActOnReportInput } from './Mutations/ActOnReport.mutation';

export const ReportTypes = [
  ReportType,

  ReportForEnum,
  ReportActionEnum,
  ReportStatusEnum,
  ReportAuditorEnum,

  ReportWhereInput,

  ReportReporterExtension,
  ReportReportedMessageExtension,

  ActOnReportInput,
  ActOnReportMutation,

  ReportDiscussionMessageInput,
  ReportDiscussionMessageMutation
];