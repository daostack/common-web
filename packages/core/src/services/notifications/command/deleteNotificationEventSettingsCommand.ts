import { prisma } from '@toolkits';
import { logger } from '@logger';

export const deleteNotificationEventSettingsCommand = async (notificationEventSetting: string): Promise<boolean> => {
  try {
    logger.info('Deleting notification event settings');

    const res = await prisma.notificationEventSettings
      .delete({
        where: {
          id: notificationEventSetting
        }
      });

    logger.info('Deleting notification event settings completed successfully!', res);


    return true;
  } catch (e) {
    logger.error('There was problem deleting notification event settings', e);

    return false;
  }
};