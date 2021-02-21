import { firestore } from 'firebase-admin';

export interface IModerationEntity {
	flag: string;
    reasons: string[];
    note: string;
    updatedAt: firestore.Timestamp;
    moderator: string;
    reporter: string;
}