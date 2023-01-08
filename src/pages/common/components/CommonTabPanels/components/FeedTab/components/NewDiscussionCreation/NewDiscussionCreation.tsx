import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Form } from "@/shared/components/Form/Formik";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor";
import { addCirclesWithHigherTier } from "@/shared/utils";
import {
  selectDiscussionCreationData,
  selectIsDiscussionCreationLoading,
} from "@/store/states";
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
  const { common, onNewCollaborationMenuItemSelect } = useCommonDataContext();
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
    onNewCollaborationMenuItemSelect(null);
    dispatch(commonActions.setDiscussionCreationData(null));
  };

  const handleSubmit = useCallback<
    FormikConfig<NewDiscussionCreationFormValues>["onSubmit"]
  >(
    (values) => {
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
              disabled={isLoading}
            />
            <DiscussionForm className={styles.discussionForm} />
            <div className={styles.buttonsContainer}>
              <div className={styles.buttonsWrapper}>
                <Button
                  className={styles.button}
                  variant={ButtonVariant.PrimaryGray}
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button className={styles.button} disabled={isLoading}>
                  Publish discussion
                </Button>
              </div>
            </div>
            {!isLoading && <DiscussionFormPersist />}
          </Form>
        )}
      </Formik>
    </CommonCard>
  );
};

export default NewDiscussionCreation;
