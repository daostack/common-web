import { ApiEndpoint } from "@/shared/constants";
import { NotionIntegration } from "@/shared/models";
import Api from "./Api";

class NotionService {
  public setupIntegration = async (
    commonId: string,
    notion: NotionIntegration,
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
