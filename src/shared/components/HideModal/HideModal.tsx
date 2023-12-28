import React, {
  FC,
  PropsWithChildren,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  hideDiscussion,
  hideProposal,
  loadDiscussionDetail,
  loadProposalDetail,
} from "@/pages/OldCommon/store/actions";
import { hideContent } from "@/pages/OldCommon/store/api";
import {
  selectCurrentDisscussion,
  selectCurrentProposal,
} from "@/pages/OldCommon/store/selectors";
import { Loader, Button } from "@/shared/components";
import { EntityTypes } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import {
  Common,
  Discussion,
  DiscussionMessage,
  Proposal,
} from "@/shared/models";
import { Modal } from "../Modal";
import "./index.scss";

interface HideModalProps {
  isShowing: boolean;
  onClose: () => void;
  type: EntityTypes;
  entity: DiscussionMessage | Discussion | Proposal | Common;
  userId: string;
  commonId: string;
}

const HideModal: FC<PropsWithChildren<HideModalProps>> = (props) => {
  const { isShowing, onClose, type, entity, userId, commonId } = props;
  const dispatch = useDispatch();
  const currentDiscussion = useSelector(selectCurrentDisscussion());
  const currentProposal = useSelector(selectCurrentProposal());
  const { notify } = useNotification();
  const [isLoading, setLoading] = useState(false);

  const buttonTypeText = useMemo(() => {
    switch (type) {
      case EntityTypes.Common:
        return "common";
      case EntityTypes.Discussion:
        return "discussion";
      case EntityTypes.Proposal:
        return "proposal";
      case EntityTypes.DiscussionMessage:
      case EntityTypes.ProposalMessage:
        return "message";
      default:
        return "";
    }
  }, [type]);

  const onRefresh = useCallback(() => {
    switch (type) {
      case EntityTypes.Discussion: {
        dispatch(hideDiscussion.request(entity.id));
        break;
      }
      case EntityTypes.DiscussionMessage: {
        if (currentDiscussion) {
          dispatch(
            loadDiscussionDetail.request({
              discussion: currentDiscussion,
              force: true,
            }),
          );
        }
        break;
      }
      case EntityTypes.Proposal: {
        dispatch(hideProposal.request(entity.id));
        break;
      }
      case EntityTypes.ProposalMessage: {
        if (currentProposal) {
          dispatch(loadProposalDetail.request(currentProposal));
        }
        break;
      }
    }
  }, [currentDiscussion, currentProposal, entity, type]);

  const onHideContent = useCallback(async () => {
    try {
      setLoading(true);
      await hideContent({
        itemId: entity.id,
        userId,
        type:
          type === EntityTypes.ProposalMessage
            ? EntityTypes.DiscussionMessage
            : type,
        commonId,
      });
      onRefresh();
      setLoading(false);
      notify("Content has been hidden");
      onClose();
    } catch (err) {
      setLoading(false);
      notify("Something went wrong");
    }
  }, [entity, userId, commonId, type, currentDiscussion]);

  return (
    <Modal
      className="hide-modal"
      isShowing={isShowing}
      onClose={onClose}
      title="Are you sure?"
      styles={{
        header: "hide-modal__header",
        content: "hide-modal__content",
      }}
    >
      <p className="hide-modal__title">This action cannot be reverted</p>
      <div className="hide-modal__button-container">
        <Button
          disabled={isLoading}
          className="hide-modal__button-container__button hide-modal__button-container__cancel"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          className="hide-modal__button-container__button hide-modal__button-container__send"
          onClick={onHideContent}
        >
          {isLoading ? (
            <Loader className="hide-modal__button-container__send__loader" />
          ) : (
            `Hide ${buttonTypeText}`
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default HideModal;
