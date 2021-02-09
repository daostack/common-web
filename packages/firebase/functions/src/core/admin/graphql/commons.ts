import { objectType } from 'nexus';

export const CommonType = objectType({
  name: 'Common',
  description: 'The common type',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The unique identifier of the common'
    });

    t.nonNull.string('name', {
      description: 'The display name of the common'
    });

    t.nonNull.int('balance', {
      description: 'The currently available funds of the common'
    });

    t.nonNull.int('totalRaised', {
      description: 'The total amount of money, raised by the common'
    });
  }
});