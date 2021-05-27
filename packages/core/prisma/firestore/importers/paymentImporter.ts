// @ts-ignore
import path from 'path';
// @ts-ignore
import fs from 'fs';

import { PaymentStatus } from '@prisma/client';

import { PaymentsCollection } from '../firestore';
import { seeder } from '../../seed';

export const convertCirclePaymentStatus = (status: string): any => {
  switch (status) {
    case 'confirmed':
    case 'paid':
      return PaymentStatus.Successful;
    case 'failed':
      return PaymentStatus.Unsuccessful;
    case 'pending':
      return PaymentStatus.Pending;
    default:
      throw new Error(`Unknown circle status ${status}`);
  }
};


export const importPayments = async (date: Date) => {
  const firebasePayments = (await PaymentsCollection.get())
    .docs.map(e => e.data());

  const promises: Promise<void>[] = [];

  const results: any[] = [];
  const errored: any[] = [];

  for (const fp of firebasePayments) {
    promises.push((async () => {
      try {
        console.log('Importing Payment');

        const join = await seeder.proposal
          .findUnique({
            where: {
              id: fp.proposalId || ''
            }
          })
          .join({
            include: {
              subscription: true,
              proposal: true
            }
          });

        if (!fp.userId) {
          console.log(fp);

          errored.push({
            reason: 'No user ID',
            payment: fp
          });
        }

        const payment = await seeder.payment
          .create({
            data: {
              id: fp.id,

              type: 'ImportedPayment',
              status: convertCirclePaymentStatus(fp.status),

              amount: Math.round(parseFloat(fp.amount.amount)),

              circlePaymentStatus: fp.status,
              circlePaymentId: fp.circlePaymentId,

              user: {
                connect: {
                  id: fp.userId
                }
              },

              card: {
                connect: {
                  id: fp.source.id
                }
              },

              ...(join && {
                join: {
                  connect: {
                    id: join.id
                  }
                }
              }),

              ...(join?.proposal?.commonId && {
                common: {
                  connect: {
                    id: join.proposal?.commonId
                  }
                }
              }),

              ...(join?.subscription && {
                subscription: {
                  connect: {
                    id: join.subscription?.id
                  }
                }
              })
            }
          });

        results.push(payment);
      } catch (e) {
        console.log(e);

        errored.push({
          payment: fp,
          error: {
            message: e.message,
            stack: e.stack
          }
        });
      }
    })());
  }

  await Promise.all(promises);

  fs.writeFileSync(path.join(__dirname, `../../result/${+date}/paymentImports-errors.json`), JSON.stringify(errored));
  fs.writeFileSync(path.join(__dirname, `../../result/${+date}/paymentImports-results.json`), JSON.stringify(results));
};