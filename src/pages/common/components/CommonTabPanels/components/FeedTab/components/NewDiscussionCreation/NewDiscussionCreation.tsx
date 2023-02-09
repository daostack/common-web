import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor";
import { addCirclesWithHigherTier } from "@/shared/utils";
import {
  selectDiscussionCreationData,
  selectIsDiscussionCreationLoading,
} from "@/store/states";
import { commonActions } from "@/store/states";
import { useCommonDataContext } from "../../../../../../providers";
import { DiscussionCreationCard, DiscussionCreationModal } from "./components";

interface NewDiscussionCreationProps {
  governanceCircles: Governance["circles"];
  commonMember: (CommonMember & CirclesPermissions) | null;
  commonImage?: string;
  commonName?: string;
  isModalVariant?: boolean;
}

const INITIAL_VALUES: NewDiscussionCreationFormValues = {
  circle: null,
  title: "",
  content: parseStringToTextEditorValue(),
  images: [],
};

const NewDiscussionCreation: FC<NewDiscussionCreationProps> = (props) => {
  const {
    governanceCircles,
    commonMember,
    commonImage,
    commonName,
    isModalVariant = false,
  } = props;
  const dispatch = useDispatch();
  const { common } = useCommonDataContext();
  const discussionCreationData = useSelector(selectDiscussionCreationData);
  const isLoading = useSelector(selectIsDiscussionCreationLoading);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const initialValues = useMemo(
    () => discussionCreationData || INITIAL_VALUES,
    [],
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

      const circleVisibility = values.circle
        ? addCirclesWithHigherTier(
            [values.circle],
            Object.values(governanceCircles),
            userCircleIds,
          ).map((circle) => circle.id)
        : [];

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
    },
    [governanceCircles, userCircleIds, userId, common.id],
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
    />
  );
};

export default NewDiscussionCreation;
