import React, { FC, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useFormikContext } from "formik";
import debounce from "lodash/debounce";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { commonActions } from "@/store/states";

const DiscussionFormPersist: FC = () => {
  const dispatch = useDispatch();
  const { values } = useFormikContext<NewDiscussionCreationFormValues>();

  const handleUpdate = useMemo(
    () =>
      debounce((values: NewDiscussionCreationFormValues) => {
        dispatch(commonActions.setDiscussionCreationData(values));
      }, 400),
    [],
  );

  useEffect(() => {
    handleUpdate(values);
  }, [values, handleUpdate]);

  return null;
};

export default DiscussionFormPersist;
