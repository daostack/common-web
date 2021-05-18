import { Common, CommonMemberRole, FundingType } from '@prisma/client';
import { seeder } from '../../seed';
import { db } from '../firestore';

export const importCommons = async () => {
  const CommonsCollection = db.collection('daos');

  const firebaseCommons = (await CommonsCollection.get()).docs.map(u => u.data());

  const failedCommons: {
    error: Error,
    from: any
  }[] = [];

  const createdCommons: {
    commons: Common,
    from: any
  }[] = [];

  for (const common of firebaseCommons) {
    console.log(`Importing ${common.name}`);

    try {
      const createdCommon = await seeder.common.create({
        data: {
          id: common.id,

          name: common.name,
          image: common.image,

          balance: Math.round(common.balance),
          raised: Math.round(common.raised),

          byline: common.metadata.byline,
          description: common.metadata.description,

          whitelisted: common.whitelisted === 'registered',

          fundingType: common.metadata.contributionType === 'monthly'
            ? FundingType.Monthly
            : FundingType.OneTime,

          fundingMinimumAmount: common.metadata.minFeeToJoin
        }
      });

      createdCommons.push({
        commons: createdCommon,
        from: common
      });

      console.info('Import of the common finished!');
      console.info('Importing common members');

      for (const member of common.members) {
        const roles = [];

        if (member.userId === common.metadata.founderId) {
          roles.push(CommonMemberRole.Founder);
        }

        try {
          await seeder.commonMember.create({
            data: {
              commonId: createdCommon.id,
              userId: member.userId,
              roles: roles as any
            }
          });
        } catch (e) {
          console.error('Cannot add common member', e);
        }
      }
    } catch (e) {
      failedCommons.push({
        error: e,
        from: common
      });

      console.info('Import failed!');
    }
  }

  console.log('[LogTag: 1333]', failedCommons);
};