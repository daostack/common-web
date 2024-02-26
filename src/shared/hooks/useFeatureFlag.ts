import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeatureFlagService } from "@/services";
import { FeatureFlags } from "../constants";

export const useUserFeatureFlag = (flag: FeatureFlags) => {
  const user = useSelector(selectUser());
  const [isFlagEnabled, setIsFlagEnabled] = useState<boolean>();

  useEffect(() => {
    (async () => {
      if (user) {
        const userFlags = await FeatureFlagService.getUserFeatureFlags(
          user?.uid,
        );
        setIsFlagEnabled(userFlags?.[flag]);
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
      const feature = await FeatureFlagService.getFeatureFlag(flag);
      setIsFlagEnabled(feature?.enabled);
    })();
  }, [flag]);

  return {
    isFlagEnabled,
  };
};
