import React, { useCallback, useState } from "react";
import { Formik } from "formik";
import { Loader, Modal } from "@/shared/components";
import {
  ModerateModalAction,
  MODERATION_TYPES,
  ModerationActionType,
} from "@/containers/Common/interfaces";
import {
  hideItem,
  openModerateModal,
  reportItem,
} from "@/containers/Common/store/actions";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { Input } from "@/shared/components/Form";
import * as Yup from "yup";
import { selectUser } from "@/containers/Auth/store/selectors";
import { getLoading } from "@/shared/store/selectors";

interface ModerateModalProps {
  onClose: () => void;
  isShowing: boolean;
  moderationModalData: ModerateModalAction;
  commonId: string;
}

const reasons = [
  "Nudity",
  "Violence",
  "Harassment",
  "False News",
  "Spam",
  "Hate speech",
  "Something Else",
];

interface ModerateModal {
  reason: string;
  moderatorNote: string;
}

const validationSchema = Yup.object({
  reason: Yup.string().required("Field required"),
  moderatorNote: Yup.string(),
});

const ModerateModal = ({
  isShowing,
  onClose,
  moderationModalData,
  commonId,
}: ModerateModalProps) => {
  const user = useSelector(selectUser());

  const loading = useSelector(getLoading());
  const dispatch = useDispatch();
  const [formValues] = useState<ModerateModal>({
    reason: "",
    moderatorNote: "",
  });

  const [showResult, setShowResult] = useState("");

  const closeModerateModalHandler = useCallback(() => {
    onClose();
    dispatch(openModerateModal(null));
  }, []);

  const getEntityType = () => {
    switch (moderationModalData.type) {
      case MODERATION_TYPES.discussion:
        return "discussion";
      case MODERATION_TYPES.proposals:
        return "proposal";
      case MODERATION_TYPES.discussionMessage:
        return "message";
    }
  };

  const getTitle = () => {
    const title =
      moderationModalData.actionType === ModerationActionType.hide
        ? "Hide "
        : "Report ";
    return title + getEntityType();
  };

  const getDescription = () => {
    if (moderationModalData.actionType !== ModerationActionType.hide) {
      return (
        <>
          <div className="description-title">
            Please select a problem to continue
          </div>
          <div className="description-content">
            You can hide the {getEntityType()} after selecting a problem
          </div>
        </>
      );
    }

    return (
      <div className="description-content">
        Please tell us what’s wrong with this {getEntityType()} . No one else
        will see the content of this report
      </div>
    );
  };

  const submitModerateForm = (values: ModerateModal) => {
    if (moderationModalData.actionType === "report") {
      const payload = {
        moderationData: {
          reasons: values.reason,
          moderatorNote: values.moderatorNote,
          itemId: moderationModalData.itemId,
        },
        userId: user?.uid,
        type: moderationModalData.type,
      };
      dispatch(reportItem.request({ payload, callback: setShowResult }));
      return;
    }
    const payload = {
      itemId: moderationModalData.itemId,
      commonId: commonId,
      userId: user?.uid,
      type: moderationModalData.type,
    };
    dispatch(hideItem.request({ payload, callback: setShowResult }));
  };

  return (
    <Modal
      isShowing={isShowing}
      onClose={closeModerateModalHandler}
      isHeaderSticky
      shouldShowHeaderShadow={false}
    >
      {!showResult ? (
        <Formik
          initialValues={formValues}
          onSubmit={submitModerateForm}
          validationSchema={validationSchema}
          validateOnMount={true}
        >
          {(formikProps) => (
            <div className="moderate-modal-wrapper">
              <div className="moderate-title">{getTitle()}</div>
              <div className="moderate-description">{getDescription()}</div>
              <div className="moderate-content">
                {loading ? <Loader /> : null}
                <div className="reasons">
                  {reasons.map((r) => (
                    <div
                      className={`reason-item ${
                        r === formikProps.values.reason ? "active" : ""
                      }`}
                      key={r}
                      onClick={() => formikProps.setFieldValue("reason", r)}
                    >
                      {r}
                    </div>
                  ))}
                </div>
                <div className="note-wrapper">
                  <div className="moderate-note">Moderator note:</div>
                  <Input
                    id="moderatorNote"
                    name="moderatorNote"
                    placeholder="Add Note"
                    isTextarea
                    value={formikProps.values.moderatorNote}
                    onChange={(e) =>
                      formikProps.setFieldValue("moderatorNote", e.target.value)
                    }
                  />
                </div>

                <div className="action-wrapper">
                  <button
                    className="button-blue"
                    disabled={!formikProps.isValid || loading}
                    type="submit"
                    onClick={formikProps.submitForm}
                  >
                    {moderationModalData.actionType === "hide"
                      ? "Hide "
                      : "Report "}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Formik>
      ) : showResult === "success" ? (
        <div className="moderate-success-wrapper">
          <img
            src="/icons/add-proposal/illustrations-full-page-send.svg"
            alt="confirm"
          />
          <div className="moderate-success-title">
            {moderationModalData.actionType === ModerationActionType.hide
              ? `The ${getEntityType()} was successfully hidden`
              : `Thanks for letting us know!`}
          </div>
          <div className="moderate-success-description">
            {moderationModalData.actionType === ModerationActionType.hide
              ? `The ${getEntityType()} will not be visible to members. You can undo this at any time.`
              : `We appreciate you letting us know, your feedback is important in helping us keep the Common safe.`}
          </div>
          <div className="actions-wrapper">
            <button
              className="button-blue white"
              type="button"
              onClick={() => closeModerateModalHandler()}
            >
              Ok
            </button>
          </div>
        </div>
      ) : (
        <div className="moderate-success-wrapper">
          <img
            src="/icons/add-proposal/illustrations-medium-alert.svg"
            alt="confirm"
          />
          <div className="moderate-success-title">Something went wrong</div>
          <div className="moderate-success-description">
            This took longer than expected, please try again later
          </div>
          <div className="actions-wrapper">
            <button
              className="button-blue white"
              type="submit"
              onClick={() => closeModerateModalHandler()}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModerateModal;
