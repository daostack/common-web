import { useCallback, useEffect, useState } from "react";
import { Logger, NotionService } from "@/services";
import { ConfirmationModalState } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { NotionIntegrationIntermediate } from "@/shared/models";

interface Data {
  projectId?: string;
  isNotionIntegrationEnabled: boolean;
}

interface Return {
  isNotionIntegrationUpdated: boolean;
  notionIntegrationErrorModalState: ConfirmationModalState;
  disconnectNotionModalState: ConfirmationModalState;
  setNotionIntegrationFormData: (
    notion?: NotionIntegrationIntermediate,
  ) => void;
}

export const useNotionIntegration = (data: Data): Return => {
  const { projectId, isNotionIntegrationEnabled } = data;
  const [notionData, setNotionData] = useState<NotionIntegrationIntermediate>();
  const [isNotionIntegrationUpdated, setIsNotionIntegrationUpdated] =
    useState(false);
  const notionIntegrationErrorModalState = useModal(false);
  const disconnectNotionModalState = useModal(false);

  const setNotionIntegrationFormData = (notion) => {
    setNotionData(notion);
  };

  const setupNotionIntegration = async (projectId: string) => {
    if (!notionData) {
      return;
    }

    try {
      await NotionService.setupIntegration(projectId, {
        databaseId: notionData.databaseId,
        token: notionData.token,
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

    if (!isNotionIntegrationEnabled && notionData?.isEnabled) {
      setupNotionIntegration(projectId);
      return;
    }

    if (isNotionIntegrationEnabled && notionData && !notionData.isEnabled) {
      disconnectNotionModalState.onOpen();
      return;
    }

    setIsNotionIntegrationUpdated(true);
  }, [projectId, isNotionIntegrationEnabled, notionData]);

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
    setNotionIntegrationFormData,
  };
};
