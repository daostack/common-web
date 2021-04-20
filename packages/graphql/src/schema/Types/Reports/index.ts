import { ReportType } from './Types/Report.type';

import { ReportForEnum } from './Enums/ReportFor.enum';
import { ReportStatusEnum } from './Enums/ReportStatus.enum';
import { ReportAuditorEnum } from './Enums/ReportAuditor.enum';

import { ReportReporterExtension } from './Extensions/ReportReporter.extension';
import { ReportReportedMessageExtension } from './Extensions/ReportReportedMessage.extension';

import {
  ReportDiscussionMessageInput,
  ReportDiscussionMessageMutation
} from './Mutations/ReportDiscussionMessage.mutation';

export const ReportTypes = [
  ReportType,

  ReportForEnum,
  ReportStatusEnum,
  ReportAuditorEnum,

  ReportReporterExtension,
  ReportReportedMessageExtension,

  ReportDiscussionMessageInput,
  ReportDiscussionMessageMutation
];