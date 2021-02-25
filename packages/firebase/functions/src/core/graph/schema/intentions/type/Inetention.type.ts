import { objectType } from "nexus";
import { IntentionTypeEnum } from '../enums/IntentionType.enum';

export const IntentionType = objectType({
  name: 'Intention',
  definition(t) {
    t.nonNull.id('id');

    t.nonNull.date('createdAt')
    t.nonNull.date('updatedAt')

    t.nonNull.field('type', {
      type: IntentionTypeEnum
    })

    t.nonNull.string('intention')
  }
})