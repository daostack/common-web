import { templateNotification } from './templateNotification';
import { stubExtractor } from './stubExtractor';
import { stubReplacer } from './stubReplacer';

export const notificationsHelper = {
  extractStubs: stubExtractor,
  replaceSubs: stubReplacer,

  template: templateNotification
};