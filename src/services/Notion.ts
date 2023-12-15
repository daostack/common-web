import firebase from "firebase";
import { ApiEndpoint } from "@/shared/constants";
import {
  Collection,
  NotionIntegration,
  NotionIntegrationPayload,
} from "@/shared/models";
import {
  firestoreDataConverter,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import Api from "./Api";

const converter = firestoreDataConverter<NotionIntegration>();

class NotionService {
  private getNotionIntegrationCollection = () =>
    firebase
      .firestore()
      .collection(Collection.NotionIntegration)
      .withConverter(converter);

  public getNotionIntegrationByCommonId = async (
    commonId: string,
  ): Promise<NotionIntegration> => {
    const notionIntegration = await this.getNotionIntegrationCollection()
      .doc(commonId)
      .get();

    return transformFirebaseDataSingle<NotionIntegration>(notionIntegration);
  };

  public setupIntegration = async (
    commonId: string,
    notion: NotionIntegrationPayload,
  ): Promise<void> => {
    await Api.post(ApiEndpoint.AddNotionIntegration, {
      ...notion,
      commonId,
    });
  };

  public removeIntegration = async (commonId: string): Promise<void> => {
    await Api.post(ApiEndpoint.RemoveNotionIntegration, { commonId });
  };
}

export default new NotionService();
