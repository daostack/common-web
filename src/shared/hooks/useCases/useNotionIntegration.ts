import { useCallback, useEffect, useState } from "react";
import { Logger, NotionService } from "@/services";
import { ConfirmationModalState } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";
import {
  NotionIntegration,
  NotionIntegrationPayloadIntermediate,
} from "@/shared/models";

interface Data {
  projectId?: string;
  isNotionIntegrationEnabled: boolean;
}

type State = LoadingState<NotionIntegration | null>;

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

interface Return extends State {
  isNotionIntegrationUpdated: boolean;
  notionIntegrationErrorModalState: ConfirmationModalState;
  disconnectNotionModalState: ConfirmationModalState;
  fetchNotionIntegration: (id: string) => void;
  setNotionIntegrationFormData: (
    notion?: NotionIntegrationPayloadIntermediate,
  ) => void;
}

export const useNotionIntegration = (data: Data): Return => {
  const { projectId, isNotionIntegrationEnabled } = data;
  const [state, setState] = useState({ ...DEFAULT_STATE });
  const [notionPayloadData, setNotionPayloadData] =
    useState<NotionIntegrationPayloadIntermediate>();
  const [isNotionIntegrationUpdated, setIsNotionIntegrationUpdated] =
    useState(false);
  const notionIntegrationErrorModalState = useModal(false);
  const disconnectNotionModalState = useModal(false);

  const fetchNotionIntegration = useCallback(async (commonId: string) => {
    setState({
      loading: true,
      fetched: false,
      data: null,
    });

    try {
      const notionIntegration =
        await NotionService.getNotionIntegrationByCommonId(commonId);

      setState({
        loading: false,
        fetched: true,
        data: notionIntegration,
      });
    } catch (error) {
      Logger.error(error);
      setState({
        loading: false,
        fetched: true,
        data: null,
      });
    }
  }, []);

  const setNotionIntegrationFormData = (notion) => {
    setNotionPayloadData(notion);
  };

  const setupNotionIntegration = async (projectId: string) => {
    if (!notionPayloadData) {
      return;
    }

    try {
      await NotionService.setupIntegration(projectId, {
        databaseId: notionPayloadData.databaseId,
        token: notionPayloadData.token,
      });
      setIsNotionIntegrationUpdated(true);
    } catch (error) {
      Logger.error(error);
      notionIntegrationErrorModalState.onOpen();
    }
  };

  const removeNotionIntegration = async (projectId?: string) => {
    if (!projectId) {
      onCloseDisconnectNotionModal();
      return;
    }

    try {
      await NotionService.removeIntegration(projectId);
    } catch (error) {
      Logger.error(error);
    } finally {
      onCloseDisconnectNotionModal();
    }
  };

  useEffect(() => {
    if (!projectId) {
      return;
    }

    if (!isNotionIntegrationEnabled && notionPayloadData?.isEnabled) {
      setupNotionIntegration(projectId);
      return;
    }

    if (
      isNotionIntegrationEnabled &&
      notionPayloadData &&
      !notionPayloadData.isEnabled
    ) {
      disconnectNotionModalState.onOpen();
      return;
    }

    setIsNotionIntegrationUpdated(true);
  }, [projectId, isNotionIntegrationEnabled, notionPayloadData]);

  const onCloseNotionIntegrationErrorModal = useCallback(() => {
    setIsNotionIntegrationUpdated(true);
    notionIntegrationErrorModalState.onClose();
  }, []);

  const onCloseDisconnectNotionModal = useCallback(() => {
    setIsNotionIntegrationUpdated(true);
    disconnectNotionModalState.onClose();
  }, []);

  const onConfirmDisconnectNotionModal = useCallback(() => {
    removeNotionIntegration(projectId);
  }, [projectId]);

  return {
    ...state,
    isNotionIntegrationUpdated,
    notionIntegrationErrorModalState: {
      isShowing: notionIntegrationErrorModalState.isShowing,
      onConfirm: onCloseNotionIntegrationErrorModal,
      onClose: onCloseNotionIntegrationErrorModal,
    },
    disconnectNotionModalState: {
      isShowing: disconnectNotionModalState.isShowing,
      onConfirm: onConfirmDisconnectNotionModal,
      onClose: onCloseDisconnectNotionModal,
    },
    fetchNotionIntegration,
    setNotionIntegrationFormData,
  };
};
