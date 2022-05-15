import firebase from "firebase/app";

export enum ModerationFlags {
	Visible = 'visible',
	Reported = 'reported',
	Hidden = 'hidden',
}

export interface Moderation {
  flag: ModerationFlags;
  reasons: string[];
  moderatorNote: string | null;
  updatedAt: firebase.firestore.Timestamp | null;
  moderator: string[];
  reporter: string | null;
}
