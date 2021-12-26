import React from "react";
import { Modal } from "../../../../../shared/components";
import { ModalProps } from "@/shared/interfaces";
import { Common } from "@/shared/models";
import "./index.scss";

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
}

const AddDiscussionComponent = ({
  isShowing,
  onClose,
}: AddDiscussionComponentProps) => {
  return (
    <Modal isShowing={isShowing} onClose={onClose}>
      <div className="add-discussion-wrapper">
        <div className="add-discussion-title">New Post</div>
        <div className="discussion-form-wrapper">
          <div className="input-wrapper">
            <label>
              Post Title <span className="required">Required</span>
            </label>
            <div className="text-area-wrapper">
              <textarea></textarea>
            </div>
          </div>
          <div className="input-wrapper">
            <label>
              Message <span className="required">Required</span>
            </label>
            <div className="text-area-wrapper">
              <textarea className="big"></textarea>
            </div>
          </div>

          <div className="action-wrapper">
            <button className="button-blue" disabled={true}>
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddDiscussionComponent;
