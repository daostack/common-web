import { v4 as uuidv4 } from "uuid";
import { Common } from "@/shared/models";
import { DeleteError, ErrorsByCommonId } from "./types";

export const parseErrorsByCommonId = (
  errorsByCommonId: ErrorsByCommonId,
  commons: Common[]
): DeleteError[] =>
  Object.entries(errorsByCommonId).reduce<DeleteError[]>(
    (acc, [commonId, errorCodes]) => {
      const common = commons.find(({ id }) => id === commonId);

      return acc.concat({
        errorCodes,
        commonId: common?.id || uuidv4(),
        commonName: common?.name || "Unknown common",
      });
    },
    []
  );
