import { firestore } from 'firebase-admin';
import { IDiscussionEntity } from './IDiscussionEntity';
import { IDiscussionMessage } from './IDiscussionMessage'
import { IProposalEntity } from './IProposalEntity'

export interface IModeration {
	flag: string;
  reasons: string[];
  moderatorNote: string;
  updatedAt: firestore.Timestamp;
  moderator: string;
  reporter: string;
  countdownPeriod?: number;
}

export type ItemType = IDiscussionEntity | IDiscussionMessage | IProposalEntity;