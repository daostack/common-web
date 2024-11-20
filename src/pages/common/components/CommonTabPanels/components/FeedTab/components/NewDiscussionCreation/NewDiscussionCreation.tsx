import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { DiscussionMessageOwnerType } from "@/shared/constants";
import {
  NewDiscussionCreationFormValues,
  UploadFile,
} from "@/shared/interfaces";
import {
  Circle,
  CirclesPermissions,
  Common,
  CommonFeedType,
  CommonMember,
  Governance,
} from "@/shared/models";
import {
  TextEditorValue,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit/TextEditor";
import {
  generateFirstMessage,
  generateOptimisticFeedItem,
  getUserName,
} from "@/shared/utils";
import {
  optimisticActions,
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
  defaultVisibility?: string;
  onDiscussionIdChange?: () => void;
}

interface InitialValues {
  circle: Circle | null;
  title: string;
  content: TextEditorValue;
  images: UploadFile[];
}

const NewDiscussionCreation: FC<NewDiscussionCreationProps> = (props) => {
  const {
    common,
    governanceCircles,
    commonMember,
    commonImage,
    commonName,
    isModalVariant = false,
    edit,
    defaultVisibility,
    onDiscussionIdChange,
  } = props;
  const dispatch = useDispatch();

  const commonId = common.id;
  const discussionCreationData = useSelector(
    selectDiscussionCreationData(commonId),
  );
  const isLoading = useSelector(selectIsDiscussionCreationLoading(commonId));
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const userCircleIds = useMemo(
    () => (commonMember ? Object.values(commonMember.circles.map) : []),
    [commonMember?.circles.map],
  );

  const handleCancel = () => {
    dispatch(commonActions.setCommonAction(null));
    dispatch(commonActions.setDiscussionCreationData({ data: null, commonId }));
  };

  const initialValues: NewDiscussionCreationFormValues = useMemo(() => {
    const values: InitialValues = {
      circle: null,
      title: "",
      content: parseStringToTextEditorValue(),
      images: [],
    };

    if (defaultVisibility) {
      const circles: Circle[] = Object.values(governanceCircles).filter(
        (circle) => userCircleIds?.includes(circle.id),
      );

      const defaultCircle = circles.find(
        (circle) => circle.id === defaultVisibility,
      );

      if (defaultCircle) {
        values.circle = defaultCircle;
      }
    }

    return values;
  }, [defaultVisibility, governanceCircles, userCircleIds]);

  const initialFormValues = discussionCreationData || initialValues;

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
            commonId,
          }),
        );
      } else {
        const discussionId = uuidv4();
        const userName = getUserName(user);

        const optimisticFeedItem = generateOptimisticFeedItem({
          userId,
          commonId: common.id,
          type: CommonFeedType.OptimisticDiscussion,
          circleVisibility,
          discussionId,
          title: values.title,
          content: JSON.stringify(values.content),
          lastMessageContent: {
            ownerId: userId,
            userName,
            ownerType: DiscussionMessageOwnerType.System,
            content: generateFirstMessage({ userName, userId }),
          },
        });
        dispatch(
          optimisticActions.setOptimisticFeedItem({
            data: optimisticFeedItem,
            common,
          }),
        );
        dispatch(commonActions.setRecentStreamId(optimisticFeedItem.data.id));
        dispatch(
          commonActions.createDiscussion.request({
            payload: {
              id: discussionId,
              title: values.title,
              message: JSON.stringify(values.content),
              ownerId: userId,
              commonId: common.id,
              images: values.images,
              circleVisibility,
            },
            commonId,
          }),
        );
      }

      handleCancel();
    },
    [governanceCircles, userCircleIds, userId, commonId, edit],
  );

  useEffect(() => {
    if (discussionCreationData?.id) {
      onDiscussionIdChange?.();
    }
  }, [discussionCreationData?.id]);

  if (
    isModalVariant &&
    typeof commonImage === "string" &&
    typeof commonName === "string"
  ) {
    return (
      <DiscussionCreationModal
        initialValues={initialFormValues}
        governanceCircles={governanceCircles}
        userCircleIds={userCircleIds}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        commonImage={commonImage}
        commonName={commonName}
        commonId={commonId}
        edit={edit}
      />
    );
  }

  return (
    <DiscussionCreationCard
      initialValues={initialFormValues}
      governanceCircles={governanceCircles}
      userCircleIds={userCircleIds}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      edit={edit}
      commonId={commonId}
    />
  );
};

export default NewDiscussionCreation;
