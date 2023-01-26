import { governanceCollection } from "@/pages/OldCommon/store/api";
import { UnsubscribeFunction } from "@/shared/interfaces";
import { Collection, Governance } from "@/shared/models";
import {
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const converter = firestoreDataConverter<Governance>();

class GovernanceService {
  public getGovernanceByCommonId = async (
    commonId: string,
  ): Promise<Governance | null> => {
    const governanceList = await governanceCollection
      .where("commonId", "==", commonId)
      .get();

    return transformFirebaseDataList<Governance>(governanceList)[0] || null;
  };

  public subscribeToGovernance = (
    governanceId: string,
    callback: (governance: Governance, isRemoved: boolean) => void,
  ): UnsubscribeFunction => {
    const query = firebase
      .firestore()
      .collection(Collection.Governance)
      .where("id", "==", governanceId)
      .withConverter(converter);

    return query.onSnapshot((snapshot) => {
      const docChange = snapshot.docChanges()[0];

      if (docChange && docChange.type !== "added") {
        callback(docChange.doc.data(), docChange.type === "removed");
      }
    });
  };
}

export default new GovernanceService();
