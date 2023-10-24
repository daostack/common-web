import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService } from "@/services";
import { Awaited, LoadingState } from "@/shared/interfaces";

type State = LoadingState<Awaited<
  ReturnType<typeof CommonService.getAllUserCommonMemberInfo>
> | null>;

type Return = State;

export const useAllUserCommonMemberInfo = (): Return => {
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const [state, setState] = useState<State>({
    loading: true,
    fetched: false,
    data: null,
  });

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = CommonService.subscribeToAllUserCommonMemberInfo(
      userId,
      (data) => {
        setState((currentState) => {
          if (!currentState.data || currentState.data.length === 0) {
            return {
              loading: false,
              fetched: true,
              data: data.map((item) => ({
                ...item.commonMember,
                commonId: item.commonId,
              })),
            };
          }

          const nextData = [...currentState.data];

          data.forEach((item) => {
            const itemIndex = nextData.findIndex(
              ({ commonId }) => commonId === item.commonId,
            );

            if (itemIndex === -1) {
              nextData.push({
                ...item.commonMember,
                commonId: item.commonId,
              });
              return;
            }

            if (item.statuses.isRemoved) {
              nextData.splice(itemIndex, 1);
            } else {
              nextData[itemIndex] = {
                ...item.commonMember,
                commonId: item.commonId,
              };
            }
          });

          return {
            loading: false,
            fetched: true,
            data: nextData,
          };
        });
      },
    );

    return () => {
      unsubscribe();
      setState({
        loading: true,
        fetched: false,
        data: null,
      });
    };
  }, [userId]);

  return state;
};
