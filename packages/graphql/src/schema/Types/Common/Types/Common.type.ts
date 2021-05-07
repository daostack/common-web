import { objectType } from 'nexus';

export const CommonType = objectType({
  name: 'Common',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The main identifier of the item'
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the item was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the item was last modified'
    });

    t.nonNull.string('name', {
      description: 'The name of the common as provided'
    });

    t.nonNull.boolean('whitelisted', {
      description: 'The whitelisting state of a common'
    });

    t.nonNull.int('balance', {
      description: 'The current available funds of the common. In cents'
    });

    t.nonNull.int('raised', {
      description: 'The total amount of money that the common has raised. In cents'
    });

    t.nonNull.string('image');
    t.string('description');
    t.string('action');
    t.string('byline');

    t.nonNull.field('fundingType', {
      type: 'FundingType'
    });

    t.nonNull.int('fundingMinimumAmount', {
      description: 'The minimum amount that the join request should provide. In cents'
    });
  }
});