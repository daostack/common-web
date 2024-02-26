import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeatureFlagService, Logger } from "@/services";
import { FeatureFlags } from "../constants";

export const useUserFeatureFlag = (flag: FeatureFlags) => {
  const user = useSelector(selectUser());
  const [isFlagEnabled, setIsFlagEnabled] = useState<boolean>();

  useEffect(() => {
    (async () => {
      if (user) {
        try {
          const userFlags = await FeatureFlagService.getUserFeatureFlags(
            user?.uid,
          );
          setIsFlagEnabled(userFlags?.[flag]);
        } catch (error) {
          Logger.error(error);
        }
      }
    })();
  }, [user?.uid, flag]);

  return {
    isFlagEnabled,
  };
};

export const useFeatureFlag = (flag: FeatureFlags) => {
  const [isFlagEnabled, setIsFlagEnabled] = useState<boolean>();

  useEffect(() => {
    (async () => {
      try {
        const feature = await FeatureFlagService.getFeatureFlag(flag);
        setIsFlagEnabled(feature?.enabled);
      } catch (error) {
        Logger.error(error);
      }
    })();
  }, [flag]);

  return {
    isFlagEnabled,
  };
};
