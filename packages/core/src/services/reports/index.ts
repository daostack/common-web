import { createReportCommand } from './commands/createReportCommand';
import { actOnReportCommand } from './commands/actOnReportCommand';

export const reportService = {
  /**
   * Creates new report for moderators or admin to
   * review and act upon
   */
  create: createReportCommand,

  /**
   * Either respects or dismisses the selected report
   */
  actOn: actOnReportCommand
};