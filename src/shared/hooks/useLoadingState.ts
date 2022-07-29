import { Dispatch, SetStateAction, useState } from "react";
import { LoadingState } from "@/shared/interfaces";

export const useLoadingState = <T>(
  initialData: T,
  {
    loading = false,
    fetched = false,
  }: { loading?: boolean; fetched?: boolean } = {}
): [LoadingState<T>, Dispatch<SetStateAction<LoadingState<T>>>] => {
  const [state, setState] = useState<LoadingState<T>>({
    loading,
    fetched,
    data: initialData,
  });

  return [state, setState];
};
