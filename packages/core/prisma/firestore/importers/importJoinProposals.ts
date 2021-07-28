// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';

import { ProposalsCollection } from '../firestore';
import { seeder } from '../../seed';
import { getEmail } from '../helpers/getEmail';
import { ProposalType } from '@prisma/client';
import { transformState } from './importFundingProposals';
import { FundingType } from 'admin/src/core/graphql';

export const transformFundingType = (ct: string): FundingType => {
  switch (ct) {
    case 'one-time':
      return FundingType.OneTime;
    case 'monthly':
      return FundingType.Monthly;
    default:
      return FundingType.OneTime;
  }
};

export const importJoinProposals = async (date: Date) => {
  const firebaseJoinProposals = (await ProposalsCollection
    .where('type', '==', 'join').get())
    .docs.map(e => e.data());

  const promises: Promise<void>[] = [];

  const results: any[] = [];
  const errored: any[] = [];

  for (const jp of firebaseJoinProposals) {
    promises.push((async () => {
      try {
        const memberExists = !!(await seeder.commonMember.count({
          where: {
            userId: jp.proposerId,
            commonId: jp.commonId
          }
        }));

        const user = await seeder.user.findUnique({
          where: {
            id: jp.proposerId
          }
        }) || await seeder.user.findUnique({
          where: {
            email: await getEmail(jp.proposerId)
          }
        });

        const cjp = await seeder.proposal
          .create({
            data: {
              id: jp.id,

              common: {
                connect: {
                  id: jp.commonId
                }
              },

              ...memberExists && {
                commonMember: {
                  connect: {
                    userId_commonId: {
                      userId: jp.proposerId,
                      commonId: jp.commonId
                    }
                  }
                }
              },

              user: {
                connect: {
                  id: user?.id || 'default'
                }
              },

              type: ProposalType.JoinRequest,

              title: (jp.description as any).title,
              description: (jp.description as any).description,

              files: (jp.description as any)?.files?.map((f: any) => ({
                value: f.value
              })) || [],

              images: (jp.description as any)?.images?.map((f: any) => ({
                value: f.value
              })) || [],

              links: (jp.description as any)?.links?.map((f: any) => ({
                title: f.title || '',
                url: f.value
              })) || [],

              state: transformState(jp.state),

              ipAddress: jp.join.ip,

              expiresAt:
                new Date(
                  jp.createdAt.toDate().getTime() +
                  jp.countdownPeriod * 1000
                ),

              votesFor: jp.votesFor,
              votesAgainst: jp.votesAgainst,

              importedFrom: JSON.stringify(jp),

              join: {
                create: {
                  id: jp.id,

                  ...(jp.join.cardId && {
                    card: {
                      connect: {
                        id: jp.join.cardId
                      }
                    }
                  }),

                  fundingType: transformFundingType(jp.join.contributionType),

                  funding: jp.join.funding
                }
              }
            }
          });

        results.push(cjp);
      } catch (e) {
        errored.push({
          proposal: jp,
          error: {
            message: e.message,
            stack: e.stack
          }
        });
      }
    })());
  }

  await Promise.all(promises);

  fs.writeFileSync(path.join(__dirname, `../../result/${+date}/joinProposalsImport-errors.json`), JSON.stringify(errored));
  fs.writeFileSync(path.join(__dirname, `../../result/${+date}/joinProposalsImport-results.json`), JSON.stringify(results));
};