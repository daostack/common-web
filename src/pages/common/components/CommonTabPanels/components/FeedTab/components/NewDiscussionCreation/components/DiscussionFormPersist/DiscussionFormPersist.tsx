import React, { FC, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useFormikContext } from "formik";
import debounce from "lodash/debounce";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { commonActions } from "@/store/states";

interface DiscussionFormPersistProps {
  commonId: string;
}

const DiscussionFormPersist: FC<DiscussionFormPersistProps> = ({
  commonId,
}) => {
  const dispatch = useDispatch();
  const { values } = useFormikContext<NewDiscussionCreationFormValues>();

  const handleUpdate = useMemo(
    () =>
      debounce((values: NewDiscussionCreationFormValues) => {
        dispatch(
          commonActions.setDiscussionCreationData({ data: values, commonId }),
        );
      }, 400),
    [],
  );

  useEffect(() => {
    handleUpdate(values);
  }, [values, handleUpdate]);

  return null;
};

export default DiscussionFormPersist;
