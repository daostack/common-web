import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeatureFlagService, Logger } from "@/services";
import { FeatureFlags } from "../constants";

export const useUserFeatureFlag = (flag: FeatureFlags) => {
  const user = useSelector(selectUser());
  const [isFlagEnabled, setIsFlagEnabled] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (user) {
        try {
          const userFlags = await FeatureFlagService.getUserFeatureFlags(
            user?.uid,
          );
          setIsFlagEnabled(userFlags?.[flag] ?? false);
        } catch (error) {
          Logger.error(error);
          setIsFlagEnabled(false);
        }
      }
    })();
  }, [user?.uid, flag]);

  return {
    isFlagEnabled,
  };
};

export const useFeatureFlag = (flag: FeatureFlags) => {
  const [isFlagEnabled, setIsFlagEnabled] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const feature = await FeatureFlagService.getFeatureFlag(flag);
        setIsFlagEnabled(feature?.enabled ?? false);
      } catch (error) {
        Logger.error(error);
        setIsFlagEnabled(false);
      }
    })();
  }, [flag]);

  return {
    isFlagEnabled,
  };
};
