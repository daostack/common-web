import React, { FC, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useFormikContext } from "formik";
import debounce from "lodash/debounce";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import { commonActions } from "@/store/states";

interface ProposalFormPersistProps {
  commonId: string;
}

const ProposalFormPersist: FC<ProposalFormPersistProps> = ({ commonId }) => {
  const dispatch = useDispatch();
  const { values } = useFormikContext<NewProposalCreationFormValues>();

  const handleUpdate = useMemo(
    () =>
      debounce((values: NewProposalCreationFormValues) => {
        dispatch(
          commonActions.setProposalCreationData({ data: values, commonId }),
        );
      }, 400),
    [],
  );

  useEffect(() => {
    handleUpdate(values);
  }, [values, handleUpdate]);

  return null;
};

export default ProposalFormPersist;
