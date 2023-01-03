import React, { FC, useCallback } from "react";
import { Formik, FormikConfig } from "formik";
import { Form } from "@/shared/components/Form/Formik";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  Circle,
  CirclesPermissions,
  CommonMember,
  Governance,
} from "@/shared/models";
import { Button, ButtonVariant, UploadFile } from "@/shared/ui-kit";
import {
  parseStringToTextEditorValue,
  TextEditorValue,
} from "@/shared/ui-kit/TextEditor";
import { useCommonDataContext } from "../../../../../../providers";
import { CommonCard } from "../../../../../CommonCard";
import { DiscussionForm, NewDiscussionHeader } from "./components";
import validationSchema from "./validationSchema";
import styles from "./NewDiscussionCreation.module.scss";

interface NewDiscussionCreationProps {
  governanceCircles: Governance["circles"];
  commonMember: (CommonMember & CirclesPermissions) | null;
}

interface FormValues {
  circle: Circle | null;
  title: string;
  content: TextEditorValue;
  images: UploadFile[];
}

const INITIAL_VALUES: FormValues = {
  circle: null,
  title: "",
  content: parseStringToTextEditorValue(),
  images: [],
};

const NewDiscussionCreation: FC<NewDiscussionCreationProps> = (props) => {
  const { governanceCircles, commonMember } = props;
  const isTabletView = useIsTabletView();
  const { onNewCollaborationMenuItemSelect } = useCommonDataContext();
  const userCircleIds = commonMember
    ? Object.values(commonMember.circles.map)
    : [];

  const handleCancel = () => {
    onNewCollaborationMenuItemSelect(null);
  };

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      console.log(values);
    },
    [],
  );

  return (
    <CommonCard hideCardStyles={isTabletView}>
      <Formik
        initialValues={INITIAL_VALUES}
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
          </Form>
        )}
      </Formik>
    </CommonCard>
  );
};

export default NewDiscussionCreation;
