import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor";
import {
  selectDiscussionCreationData,
  selectIsDiscussionCreationLoading,
} from "@/store/states";
import { commonActions } from "@/store/states";
import { DiscussionCreationCard, DiscussionCreationModal } from "./components";

interface NewDiscussionCreationProps {
  common: Common;
  governanceCircles: Governance["circles"];
  commonMember: (CommonMember & CirclesPermissions) | null;
  commonImage?: string;
  commonName?: string;
  isModalVariant?: boolean;
  edit?: boolean;
}

const INITIAL_VALUES: NewDiscussionCreationFormValues = {
  circle: null,
  title: "",
  content: parseStringToTextEditorValue(),
  images: [],
};

const NewDiscussionCreation: FC<NewDiscussionCreationProps> = (props) => {
  const {
    common,
    governanceCircles,
    commonMember,
    commonImage,
    commonName,
    isModalVariant = false,
    edit,
  } = props;
  const dispatch = useDispatch();
  const discussionCreationData = useSelector(selectDiscussionCreationData);
  const isLoading = useSelector(selectIsDiscussionCreationLoading);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const initialValues = useMemo(
    () => discussionCreationData || INITIAL_VALUES,
    [discussionCreationData],
  );
  const userCircleIds = useMemo(
    () => (commonMember ? Object.values(commonMember.circles.map) : []),
    [commonMember?.circles.map],
  );

  const handleCancel = () => {
    dispatch(commonActions.setCommonAction(null));
    dispatch(commonActions.setDiscussionCreationData(null));
  };

  const handleSubmit = useCallback(
    (values: NewDiscussionCreationFormValues) => {
      if (!userId) {
        return;
      }

      const circleVisibility = values.circle ? [values.circle.id] : [];

      if (edit) {
        dispatch(
          commonActions.editDiscussion.request({
            payload: {
              id: values.id,
              title: values.title,
              message: JSON.stringify(values.content),
              images: values.images,
            },
          }),
        );
      } else {
        dispatch(
          commonActions.createDiscussion.request({
            payload: {
              title: values.title,
              message: JSON.stringify(values.content),
              ownerId: userId,
              commonId: common.id,
              images: values.images,
              circleVisibility,
            },
          }),
        );
      }
    },
    [governanceCircles, userCircleIds, userId, common.id, edit],
  );

  if (
    isModalVariant &&
    typeof commonImage === "string" &&
    typeof commonName === "string"
  ) {
    return (
      <DiscussionCreationModal
        initialValues={initialValues}
        governanceCircles={governanceCircles}
        userCircleIds={userCircleIds}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        commonImage={commonImage}
        commonName={commonName}
        edit={edit}
      />
    );
  }

  return (
    <DiscussionCreationCard
      initialValues={initialValues}
      governanceCircles={governanceCircles}
      userCircleIds={userCircleIds}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      edit={edit}
    />
  );
};

export default NewDiscussionCreation;
