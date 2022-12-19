import { useCallback, useState } from "react";
import { LoadingState } from "@/shared/interfaces";
import { BankAccountDetails } from "@/shared/models";
import { getBankDetailsByUserId } from "@/pages/OldCommon/store/api";


type State = LoadingState<BankAccountDetails | null>;

interface Return extends State {
  fetchBankAccountDetailsByUserId: (userId: string) => void;
}

export const useBankAccountDetails = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });

  const fetchBankAccountDetailsByUserId = useCallback(
    (userId: string) => {
      setState((nextState) => ({
        ...nextState,
        loading: true,
      }));

      (async () => {
        try {
          const bankAccountDetails = await getBankDetailsByUserId(userId);

          setState({
            loading: false,
            fetched: true,
            data: bankAccountDetails,
          });
        } catch (error) {
          setState({
            loading: false,
            fetched: true,
            data: null
          });
        }
      })();
    },
    [],
  );

  return {
    ...state,
    fetchBankAccountDetailsByUserId,
  };
};
