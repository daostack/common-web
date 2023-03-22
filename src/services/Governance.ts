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

  public getGovernanceListByCommonIds = async (
    commonIds: string[],
  ): Promise<Governance[]> => {
    if (commonIds.length === 0) {
      return [];
    }

    const queries: firebase.firestore.Query[] = [];

    // Firebase allows to use at most 10 items per query for `in` option
    for (let i = 0; i < commonIds.length; i += 10) {
      queries.push(
        governanceCollection.where(
          "commonId",
          "in",
          commonIds.slice(i, i + 10),
        ),
      );
    }
    const results = await Promise.all(queries.map((query) => query.get()));

    return results
      .map((result) => transformFirebaseDataList<Governance>(result))
      .reduce((acc, items) => [...acc, ...items], []);
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
