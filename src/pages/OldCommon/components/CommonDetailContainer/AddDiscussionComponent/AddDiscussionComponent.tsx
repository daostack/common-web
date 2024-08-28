import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MultiValue, SingleValue } from "react-select";
import classNames from "classnames";
import { Formik } from "formik";
import { omit } from "lodash";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { createDiscussion } from "@/pages/OldCommon/store/actions";
import { getCommonGovernanceCircles } from "@/pages/OldCommon/store/api";
import { Modal } from "@/shared/components";
import { TextField } from "@/shared/components/Form/Formik";
import { ToggleSwitch } from "@/shared/components/ToggleSwitch/ToggleSwitch";
import { ScreenSize } from "@/shared/constants";
import { useZoomDisabling } from "@/shared/hooks";
import { ModalProps } from "@/shared/interfaces";
import { SelectType } from "@/shared/interfaces/Select";
import { Circle, Discussion } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { CircleSelectType, CirclesSelect } from "./Select/CirclesSelect";
import "./index.scss";

const MAX_TITLE_LENGTH = 49;
const MAX_MESSAGE_LENGTH = 690;

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  onSuccess: (discussion: Discussion) => void;
  uid: string;
  commonId: string;
  governanceId: string;
  userCircleIds?: string[];
}

const validationSchema = Yup.object({
  message: Yup.string()
    .max(MAX_MESSAGE_LENGTH, "Message too long")
    .required("Field required"),
  title: Yup.string()
    .required("Field required")
    .max(MAX_TITLE_LENGTH, "Title too long"),
  isLimitedDiscussion: Yup.boolean(),
  circleVisibility: Yup.array().when("isLimitedDiscussion", {
    is: (isLimitedDiscussion) => isLimitedDiscussion === true,
    then: (schema) => schema.min(1, "Please add at least 1 circle"),
    otherwise: (schema) => schema.min(0),
  }),
});

interface FormValues {
  title: string;
  message: string;
  circleVisibility: SelectType<Circle>[];
  isLimitedDiscussion: boolean;
}

const INITIAL_VALUES: FormValues = {
  title: "",
  message: "",
  circleVisibility: [],
  isLimitedDiscussion: false,
};

const AddDiscussionComponent = ({
  isShowing,
  onClose,
  onSuccess,
  uid,
  commonId,
  governanceId,
  userCircleIds,
}: AddDiscussionComponentProps) => {
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });

  const dispatch = useDispatch();
  const screenSize = useSelector(getScreenSize());
  const [pending, setPending] = useState(false);
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [circleOptions, setCircleOptions] = useState<SelectType<Circle>[]>([]);

  useEffect(() => {
    (async () => {
      const governanceCircles = await getCommonGovernanceCircles(governanceId);
      const circles = (
        governanceCircles ? Object.values(governanceCircles) : []
      )?.map((circle) => ({
        ...circle,
        value: circle.id,
        label: circle.name,
      }));
      setCircleOptions(circles);
    })();
  }, [governanceId]);

  useEffect(() => {
    if (isShowing) {
      disableZoom();
    } else {
      resetZoom();
    }
  }, [isShowing, disableZoom, resetZoom]);

  const addDiscussion = useCallback(
    (values: FormValues) => {
      setPending(true);
      const circleVisibility = (values.circleVisibility || [])?.map(
        ({ value }) => value,
      );
      const payload = omit(values, "isLimitedDiscussion");


      // TODO: CHECK if it needed for optimistic
      const discussionId = uuidv4();
      dispatch(
        createDiscussion.request({
          payload: {
            ...payload,
            id: discussionId,
            ownerId: uid,
            commonId: commonId,
            circleVisibility,
          },
          callback: (discussion: Discussion) => {
            onSuccess(discussion);
          },
        }),
      );
    },
    [dispatch],
  );

  return (
    <Modal
      isShowing={isShowing}
      onClose={onClose}
      className={classNames("create-discussion-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
      closePrompt
    >
      <Formik
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          addDiscussion(values);
        }}
        initialValues={INITIAL_VALUES}
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={false}
        isInitialValid={false}
      >
        {(formikProps) => {
          const handleCirclesSelect = (
            data: MultiValue<CircleSelectType> | SingleValue<CircleSelectType>,
          ) => {
            formikProps.setFieldValue("circleVisibility", data);
          };

          return (
            <div className="add-discussion-wrapper">
              <div className="add-discussion-title">New Discussion</div>
              <div className="discussion-form-wrapper">
                <div className="input-wrapper">
                  <div
                    className={`text-area-wrapper ${
                      formikProps.errors.title ? "error" : ""
                    }`}
                  >
                    <TextField
                      id="title"
                      label="Discussion Title"
                      name={"title"}
                      maxLength={MAX_TITLE_LENGTH}
                      value={formikProps.values.title}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isRequired={true}
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <div
                    className={`text-area-wrapper ${
                      formikProps.errors.message ? "error" : ""
                    }`}
                  >
                    <TextField
                      className="big"
                      label="Message"
                      id="message"
                      name={"message"}
                      maxLength={MAX_MESSAGE_LENGTH}
                      value={formikProps.values.message}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isRequired={true}
                      isTextarea={true}
                    />
                  </div>
                </div>
                <ToggleSwitch
                  label="Limited discussion"
                  isChecked={formikProps.values.isLimitedDiscussion}
                  onChange={(toggleState) =>
                    formikProps.setFieldValue(
                      "isLimitedDiscussion",
                      toggleState,
                    )
                  }
                />
                {formikProps.values.isLimitedDiscussion && (
                  <CirclesSelect
                    onBlur={formikProps.handleBlur("circleVisibility")}
                    placeholder="Choose circles"
                    value={formikProps.values.circleVisibility}
                    handleChange={handleCirclesSelect}
                    options={circleOptions}
                    error={
                      (formikProps.touched.circleVisibility &&
                        formikProps.errors.circleVisibility) as string
                    }
                    isOptionDisabled={(option) =>
                      !userCircleIds?.includes(option.id)
                    }
                  />
                )}
                <div className="action-wrapper">
                  <button
                    className="button-blue"
                    disabled={!formikProps.isValid || pending}
                    onClick={formikProps.submitForm}
                  >
                    Publish Discussion
                  </button>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default AddDiscussionComponent;
