import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useIsTabletView } from "@/shared/hooks/viewport";
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
import { CommonCard } from "../../../../../CommonCard";
import { DiscussionCreationForm } from "./components";

interface NewDiscussionCreationProps {
  governanceCircles: Governance["circles"];
  commonMember: (CommonMember & CirclesPermissions) | null;
}

const INITIAL_VALUES: NewDiscussionCreationFormValues = {
  circle: null,
  title: "",
  content: parseStringToTextEditorValue(),
  images: [],
};

const NewDiscussionCreation: FC<NewDiscussionCreationProps> = (props) => {
  const { governanceCircles, commonMember } = props;
  const dispatch = useDispatch();
  const isTabletView = useIsTabletView();
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
    [commonMember],
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

  return (
    <CommonCard hideCardStyles={isTabletView}>
      <DiscussionCreationForm
        initialValues={initialValues}
        governanceCircles={governanceCircles}
        userCircleIds={userCircleIds}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </CommonCard>
  );
};

export default NewDiscussionCreation;
