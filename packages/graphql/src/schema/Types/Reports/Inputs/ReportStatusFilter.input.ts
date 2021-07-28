import { inputObjectType } from 'nexus';

export const ReportStatusFilterInput = inputObjectType({
  name: 'ReportStatusFilterInput',
  definition(t) {
    t.list.field('in', {
      type: 'ReportStatus'
    });

    t.list.field('not', {
      type: 'ReportStatus'
    });
  }
});