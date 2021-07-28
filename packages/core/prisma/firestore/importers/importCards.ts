// @ts-ignore
import path from 'path';
// @ts-ignore
import fs from 'fs';

import { CardsCollection } from '../firestore';
import { seeder } from '../../seed';
import { CardNetwork } from '@prisma/client';

export const importCards = async (date: Date) => {
  const firebaseCards = (await CardsCollection.get())
    .docs.map(e => e.data());

  const promises: Promise<void>[] = [];

  const results: any[] = [];
  const errored: any[] = [];

  for (const fc of firebaseCards) {
    promises.push((async () => {
      try {
        const card = await seeder.card
          .create({
            data: {
              id: fc.id,

              circleCardId: fc.circleCardId,

              cvvCheck: fc.verification?.cvv || 'no verification',
              avsCheck: 'no verification',

              digits: fc.metadata?.digits || '',
              network: fc.metadata?.network || CardNetwork.VISA,

              user: {
                connect: {
                  id: fc.ownerId
                }
              }
            }
          });

        results.push(card);
      } catch (e) {
        errored.push({
          proposal: fc,
          error: {
            message: e.message,
            stack: e.stack
          }
        });
      }
    })());
  }

  await Promise.all(promises);

  fs.writeFileSync(path.join(__dirname, `../../result/${+date}/cardImports-errors.json`), JSON.stringify(errored));
  fs.writeFileSync(path.join(__dirname, `../../result/${+date}/cardImports-results.json`), JSON.stringify(results));
};