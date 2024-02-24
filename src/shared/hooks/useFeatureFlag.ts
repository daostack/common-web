import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeatureFlagService } from "@/services";
import { FeaturesFlags } from "../constants";

export const useUserFeatureFlag = (flag: FeaturesFlags) => {
  const user = useSelector(selectUser());
  const [isFlagEnabled, setIsFlagEnabled] = useState<boolean | undefined>();

  useEffect(() => {
    (async () => {
      if (user) {
        const userFlags = await FeatureFlagService.getUserFeatureFlags(
          user?.uid,
        );
        setIsFlagEnabled(userFlags?.[flag]);
      }
    })();
  }, [user?.uid]);

  return {
    isFlagEnabled,
  };
};

export const useFeatureFlag = (flag: FeaturesFlags) => {
  const [isFlagEnabled, setIsFlagEnabled] = useState<boolean | undefined>();

  useEffect(() => {
    (async () => {
      const feature = await FeatureFlagService.getFeatureFlag(flag);
      setIsFlagEnabled(feature?.enabled);
    })();
  }, []);

  return {
    isFlagEnabled,
  };
};
