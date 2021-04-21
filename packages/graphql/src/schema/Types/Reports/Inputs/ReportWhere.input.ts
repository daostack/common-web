import { inputObjectType } from 'nexus';

export const ReportWhereInput = inputObjectType({
  name: 'ReportWhereInput',
  definition(t) {
    t.field('status', {
      type: 'ReportStatus'
    });

    t.field('for', {
      type: 'ReportFor'
    });

    t.field('status', {
      type: 'ReportStatusFilterInput'
    });
  }
});