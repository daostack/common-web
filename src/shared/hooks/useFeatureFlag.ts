import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeatureFlagService, Logger } from "@/services";
import { FeatureFlagVisibility, FeatureFlags } from "../constants";
import { FeatureFlagOptions } from "../models";

export const useFeatureFlag = () => {
  const [flags, setFlags] = useState<Map<FeatureFlags, boolean> | undefined>();
  const user = useSelector(selectUser());

  const checkIsEnabled = (flag: FeatureFlagOptions, teamIds: string[]): boolean => {
    if(!flag.enabled) {
      return false;
    }

    if(flag.visibility === FeatureFlagVisibility.ALL) {
      return true;
    } else if (flag.visibility === FeatureFlagVisibility.USERS) {
      return user?.uid ? flag.users.includes(user?.uid) : false;
    } else if (flag.visibility === FeatureFlagVisibility.TEAM) {
      return user?.uid ? teamIds.includes(user?.uid) : false;
    }

    return true;
  }

  useEffect(() => {
    (async () => {
      try {
        const feature = await FeatureFlagService.getFeatureFlag();
        const featureFlags = new Map<FeatureFlags, boolean>();

        feature?.features.forEach((flag) => {
          const isEnabled = checkIsEnabled(flag, feature.teamIds);
          featureFlags.set(flag.feature, isEnabled)
        })

        setFlags(featureFlags);
      } catch (error) {
        Logger.error(error);
      }
    })();
  }, [user]);

  return flags;
};
