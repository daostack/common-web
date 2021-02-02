import { ICommonEntity } from '@common/types';
import firebase from 'firebase';
import { NotFoundError } from '../../../../errors';
import Timestamp = firebase.firestore.Timestamp;

jest.mock('../../../../../common/database/getCommon', () =>
  ({
    getCommon: jest.fn()
      .mockImplementation(async (proposalId: string): Promise<ICommonEntity> => {
        if (proposalId === '404' || proposalId === '00000000-0000-0000-0000-000000000000') {
          throw new NotFoundError(proposalId, 'proposal');
        }

        const contributionType = proposalId === '00000000-0000-0000-0000-000000000001'
          ? 'monthly'
          : 'one-time';

        return {
          links: [],
          image: 'https://firebasestorage.googleapis.com/v0/b/common-staging-50741.appspot.com/o/public_img%2Fimg_1605603725987.jpg?alt=media&token=4fc5ab99-8f38-49f0-8d6e-83a94b30db60',
          fundingGoalDeadline: 1606206379,
          metadata: {
            minFeeToJoin: 700,
            description: 'testetest',
            founderId: 'Xlun3Ux94Zfc73axkiuVdkktOWf1',
            byline: 'testtestetstetst',
            contributionType: contributionType
          },
          raised: 0,
          rules: [
            {
              title: 'Sdf',
              value: 'sdfsdfs'
            }
          ],
          createdAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
          balance: 0,
          members: [
            {
              userId: 'Xlun3Ux94Zfc73axkiuVdkktOWf1'
            }
          ],
          name: 'test',
          id: '01e88ab1-303e-4cfb-9d7b-992d469d9ae6',
          updatedAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
          register: 'na'
        };
      })
  }));