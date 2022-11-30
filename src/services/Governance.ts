import { governanceCollection } from "@/pages/OldCommon/store/api";
import { Governance } from "@/shared/models";
import { transformFirebaseDataList } from "@/shared/utils";

class GovernanceService {
  public getGovernanceByCommonId = async (
    commonId: string,
  ): Promise<Governance | null> => {
    const governanceList = await governanceCollection
      .where("commonId", "==", commonId)
      .get();

    return transformFirebaseDataList<Governance>(governanceList)[0] || null;
  };
}

export default new GovernanceService();
