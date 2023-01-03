import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { Form } from "@/shared/components/Form/Formik";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor";
import { selectDiscussionCreationData } from "@/store/states";
import { commonActions } from "@/store/states";
import { useCommonDataContext } from "../../../../../../providers";
import { CommonCard } from "../../../../../CommonCard";
import {
  DiscussionForm,
  DiscussionFormPersist,
  NewDiscussionHeader,
} from "./components";
import validationSchema from "./validationSchema";
import styles from "./NewDiscussionCreation.module.scss";

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
  const { onNewCollaborationMenuItemSelect } = useCommonDataContext();
  const initialValues =
    useSelector(selectDiscussionCreationData) || INITIAL_VALUES;
  const userCircleIds = commonMember
    ? Object.values(commonMember.circles.map)
    : [];

  const handleCancel = () => {
    onNewCollaborationMenuItemSelect(null);
    dispatch(commonActions.setDiscussionCreationData(null));
  };

  const handleSubmit = useCallback<
    FormikConfig<NewDiscussionCreationFormValues>["onSubmit"]
  >((values) => {
    console.log(values);
  }, []);

  return (
    <CommonCard hideCardStyles={isTabletView}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ values, setFieldValue }) => (
          <Form className={styles.form}>
            <NewDiscussionHeader
              currentCircle={values.circle}
              governanceCircles={governanceCircles}
              userCircleIds={userCircleIds}
              onCircleSave={(circle) => setFieldValue("circle", circle)}
            />
            <DiscussionForm className={styles.discussionForm} />
            <div className={styles.buttonsContainer}>
              <div className={styles.buttonsWrapper}>
                <Button
                  className={styles.button}
                  variant={ButtonVariant.PrimaryGray}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button className={styles.button}>Publish discussion</Button>
              </div>
            </div>
            <DiscussionFormPersist />
          </Form>
        )}
      </Formik>
    </CommonCard>
  );
};

export default NewDiscussionCreation;
