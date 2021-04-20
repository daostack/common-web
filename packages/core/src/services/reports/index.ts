import { createReportCommand } from './commands/createReportCommand';

export const reportService = {
  /**
   * Creates new report for moderators or admin to
   * review and act upon
   */
  create: createReportCommand
};