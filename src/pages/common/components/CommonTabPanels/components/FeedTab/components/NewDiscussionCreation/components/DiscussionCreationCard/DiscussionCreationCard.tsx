import React, { FC } from "react";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { Circles } from "@/shared/models";
import { CommonCard } from "../../../../../../../CommonCard";
import { DiscussionCreationForm } from "../DiscussionCreationForm";

type FormValues = NewDiscussionCreationFormValues;

interface DiscussionCreationCardProps {
  initialValues: FormValues;
  governanceCircles: Circles;
  userCircleIds: string[];
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const DiscussionCreationCard: FC<DiscussionCreationCardProps> = (props) => {
  const {
    initialValues,
    governanceCircles,
    userCircleIds,
    onSubmit,
    onCancel,
    isLoading = false,
  } = props;

  return (
    <CommonCard>
      <DiscussionCreationForm
        initialValues={initialValues}
        governanceCircles={governanceCircles}
        userCircleIds={userCircleIds}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    </CommonCard>
  );
};

export default DiscussionCreationCard;
