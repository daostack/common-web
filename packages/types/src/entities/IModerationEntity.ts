import { firestore } from 'firebase-admin';
import { IDiscussionEntity } from './IDiscussionEntity';
import { IDiscussionMessage } from './IDiscussionMessage'
import { IProposalEntity } from './IProposalEntity'

export interface IModerationEntity {
	flag: string;
    reasons: string[];
    note: string;
    updatedAt: firestore.Timestamp;
    moderator: string;
    reporter: string;
}

export type ItemType = IDiscussionEntity | IDiscussionMessage | IProposalEntity;