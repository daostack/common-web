import { inputObjectType, list } from 'nexus';

export const PayoutStatusFilterInput = inputObjectType({
  name: 'PayoutStatusFilter',
  definition(t) {
    t.field('in', {
      type: list('PayoutStatus')
    });

    t.field('notIn', {
      type: list('PayoutStatus')
    });

    t.field('equals', {
      type: 'PayoutStatus'
    });

    t.field('not', {
      type: 'PayoutStatus'
    });
  }
});