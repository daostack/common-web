import { ReportType } from './Types/Report.type';

import { ReportForEnum } from './Enums/ReportFor.enum';
import { ReportFlagEnum } from './Enums/ReportFlag.enum';
import { ReportStatusEnum } from './Enums/ReportStatus.enum';
import { ReportActionEnum } from './Enums/ReportAction.enum';
import { ReportAuditorEnum } from './Enums/ReportAuditor.enum';

import { ReportWhereInput } from './Inputs/ReportWhere.input';
import { ReportStatusFilterInput } from './Inputs/ReportStatusFilter.input';

import { ReportReporterExtension } from './Extensions/ReportReporter.extension';
import { ReportTypeEnum } from './Enums/ReportType.enum';

import { ReportReportedMessageExtension } from './Extensions/ReportReportedMessage.extension';
import { ReportReportedProposalExtension } from './Extensions/ReportReportedProposal.extension';

import { CreateReportMutation } from './Mutations/CreateReport.mutation';

import { ActOnReportMutation, ActOnReportInput } from './Mutations/ActOnReport.mutation';
import { GetReportsQuery } from './Queries/GetReports.query';

export const ReportTypes = [
  ReportType,

  ReportForEnum,
  ReportFlagEnum,
  ReportActionEnum,
  ReportStatusEnum,
  ReportAuditorEnum,
  ReportTypeEnum,

  ReportWhereInput,
  ReportStatusFilterInput,

  ReportReporterExtension,
  ReportReportedMessageExtension,
  ReportReportedProposalExtension,

  ActOnReportInput,
  ActOnReportMutation,

  CreateReportMutation,
  GetReportsQuery
];