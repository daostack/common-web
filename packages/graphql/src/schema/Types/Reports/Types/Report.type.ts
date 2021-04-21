import { objectType } from 'nexus';

export const ReportType = objectType({
  name: 'Report',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.field('status', {
      type: 'ReportStatus',
      description: 'The current status of the report'
    });

    t.nonNull.field('for', {
      type: 'ReportFor',
      description: 'The type of violation that this report is for'
    });

    t.nonNull.string('note', {
      description: 'The note that the report has left for the content'
    });

    t.date('reviewedOn', {
      description: 'The date on which the report was last reviewed if reviewed'
    });
  }
});