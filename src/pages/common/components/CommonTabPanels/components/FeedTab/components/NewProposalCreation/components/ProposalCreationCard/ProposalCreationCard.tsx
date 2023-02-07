import React, { FC } from "react";
import { CommonCard } from "@/pages/common/components/CommonCard";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import { Circles, Governance } from "@/shared/models";
import { ProposalCreationForm } from "../ProposalCreationForm";

type FormValues = NewProposalCreationFormValues;

interface ProposalCreationCardProps {
  initialValues: FormValues;
  governanceCircles: Circles;
  userCircleIds: string[];
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  governance: Governance;
}

const ProposalCreationCard: FC<ProposalCreationCardProps> = (props) => {
  const {
    initialValues,
    governanceCircles,
    userCircleIds,
    onSubmit,
    onCancel,
    isLoading = false,
    governance,
  } = props;

  return (
    <CommonCard>
      <ProposalCreationForm
        initialValues={initialValues}
        governanceCircles={governanceCircles}
        userCircleIds={userCircleIds}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
        governance={governance}
      />
    </CommonCard>
  );
};

export default ProposalCreationCard;
