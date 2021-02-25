import { inputObjectType } from 'nexus';
import { IntentionTypeEnum } from '../enums/IntentionType.enum';

export const CreateIntentionInput = inputObjectType({
  name: 'CreateIntentionInput',
  definition(t) {
    t.nonNull.field('type', {
      type: IntentionTypeEnum
    });

    t.nonNull.string('intention');
  }
});