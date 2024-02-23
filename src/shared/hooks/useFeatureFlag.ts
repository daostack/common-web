import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeatureFlagService } from "@/services";
import { FeaturesFlags } from "../constants";

export const useFeatureFlag = (flag: FeaturesFlags) => {
  const user = useSelector(selectUser());
  const [userFlag, setUserFlag] = useState<boolean | undefined>();

  useEffect(() => {
    (async () => {
      if (user) {
        const userFlags = await FeatureFlagService.getUserFeatureFlags(
          user?.uid,
        );
        setUserFlag(userFlags?.[flag]);
      }
    })();
  }, [user?.uid]);

  return {
    userFlag,
  };
};
