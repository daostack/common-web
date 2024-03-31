import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, GovernanceService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import {
  CirclesPermissions,
  Common,
  CommonMember
} from "@/shared/models";
import { SpaceListVisibility } from "@/shared/interfaces";
import {
  generateCirclesDataForCommonMember
} from "@/shared/utils";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";

type CommonWithUserInfo = Common & {
  commonMember: (CommonMember & CirclesPermissions) | null;
  hasAccessToSpace: boolean;
}

interface Options {
  commons: Common[];
}

type State = LoadingState<(CommonWithUserInfo[]) | null>;


interface Return extends State {
  fetchAdditionalCommonInfo: () => void;
}

export const useProjectsData = (options: Options): Return => {
  const {
    commons
  } = options;
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchAdditionalCommonInfo = useCallback(
    async () => {
      if (state.loading || state.fetched) {
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: null,
      });

      const updatedCommonData = await Promise.all(commons.map(async (common) => {
        try {
          const [governance, commonMember] = await Promise.all([
            GovernanceService.getGovernanceByCommonId(common.id),
            userId ? CommonService.getCommonMemberByUserId(common.id, userId) : null,
          ]);

          if (governance && commonMember) {
            const commonMemberData = {
              ...commonMember,
              ...generateCirclesDataForCommonMember(
                governance.circles,
                commonMember.circleIds,
              )
            };

            return {
              ...common,
              commonMember: commonMemberData,
              hasAccessToSpace: (common.listVisibility === SpaceListVisibility.Public) || Boolean(commonMemberData) || !common.listVisibility,
            };
          }
        } catch (e) {
          return {
            ...common,
            commonMember: null,
            hasAccessToSpace: common.listVisibility === SpaceListVisibility.Public || !common.listVisibility
          }
        }

        return {
          ...common,
          commonMember: null,
          hasAccessToSpace: common.listVisibility === SpaceListVisibility.Public || !common.listVisibility,
        }
      }
      ));

      const finalState: State = {
        loading: false,
        fetched: true,
        data: updatedCommonData,
      };

      setState(finalState);
    },
    [state, commons, userId],
  );

  useEffect(() => {
    if(commons.length > 0) {
      fetchAdditionalCommonInfo();
    }
    
  }, [commons])

  return {
    ...state,
    fetchAdditionalCommonInfo,
  };
};
