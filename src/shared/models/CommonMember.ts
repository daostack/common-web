import firebase from "firebase/app";
import { Reputation } from "./governance/Reputation";

export interface CommonMember {
  readonly userId: string;
  joinedAt: firebase.firestore.Timestamp;
  circles: {
    [key in string]: true;
  };
  tokenBalance: number;
  reputation: Partial<Reputation>;
}
