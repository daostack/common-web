import { CommonService } from "@/services";
import {
  Common,
  CommonState
} from "@/shared/models";


export const getCommon = async (commonId: string): Promise<Common | null> =>
  (await CommonService.getCachedCommonById(commonId)) ||
  (await CommonService.getCommonById(commonId, false, CommonState.INACTIVE));