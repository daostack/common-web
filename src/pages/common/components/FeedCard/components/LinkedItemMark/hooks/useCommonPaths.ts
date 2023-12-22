import { CommonService } from "@/services";
import { useIsMounted, useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";
import { Common } from "@/shared/models";

type Data = Common[][];

interface Return extends LoadingState<Data> {
  fetchCommonPaths: (commonIdsForPaths: string[]) => void;
}

export const useCommonPaths = (): Return => {
  const isMounted = useIsMounted();
  const [state, setState] = useLoadingState<Data>([]);

  const fetchCommonPaths = async (commonIdsForPaths: string[]) => {
    setState({
      loading: true,
      fetched: false,
      data: [],
    });

    let commons: Data = [];

    try {
      commons = await Promise.all(
        commonIdsForPaths.map((commonId) =>
          CommonService.getCommonAndParents(commonId),
        ),
      );
      commons = commons.filter((path) => path.length > 0);
    } catch (err) {
      commons = [];
    } finally {
      if (isMounted()) {
        setState({
          loading: false,
          fetched: true,
          data: commons,
        });
      }
    }
  };

  return {
    ...state,
    fetchCommonPaths,
  };
};
