import { enumType } from 'nexus';

export const IntentionTypeEnum = enumType({
  name: 'IntentionType',
  members: [
    'access',
    'request'
  ]
});