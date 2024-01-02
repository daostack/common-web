import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { CenterWrapper } from "@/pages/commonCreation/components";
import { styles } from "@/pages/commonCreation/components/ProjectCreation";
import { ButtonLink } from "@/shared/components";
import { GovernanceActions } from "@/shared/constants";
import { useGoBack } from "@/shared/hooks";
import { LongLeftArrowIcon } from "@/shared/icons";
import { Common } from "@/shared/models";
import { Container, Loader } from "@/shared/ui-kit";
import { getCommonPageAboutTabPath } from "@/shared/utils";
import { EditingForm } from "./components";
import editingStyles from "./Editing.module.scss";

interface EditingProps {
  common: Common;
}

const Editing: FC<EditingProps> = (props) => {
  const { common } = props;
  const history = useHistory();
  const { canGoBack, goBack } = useGoBack();
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const loaderEl = (
    <CenterWrapper>
      <Loader />
    </CenterWrapper>
  );
  const backRoute = getCommonPageAboutTabPath(common.id);

  const handleUpdatedCommon = (updatedCommon: Common) => {
    CommonEventEmitter.emit(CommonEvent.ProjectUpdated, {
      commonId: updatedCommon.id,
      image: updatedCommon.image,
      name: updatedCommon.name,
    });
    CommonEventEmitter.emit(CommonEvent.CommonUpdated, updatedCommon);
    history.push(getCommonPageAboutTabPath(updatedCommon.id));
  };

  const handleBackButtonClick = () => {
    if (canGoBack) {
      goBack();
    } else {
      history.push(backRoute);
    }
  };

  useEffect(() => {
    fetchCommonMember(common.id, {}, true);
  }, [common.id, userId]);

  if (!isCommonMemberFetched) {
    return loaderEl;
  }

  if (
    !commonMember ||
    !commonMember.allowedActions[GovernanceActions.UPDATE_COMMON]
  ) {
    return <Redirect to={backRoute} />;
  }

  const handleUpdatedCommonCancel = () => {
    history.push(backRoute);
  };

  return (
    <Container className={styles.container}>
      <div className={styles.content}>
        <ButtonLink className={styles.backLink} onClick={handleBackButtonClick}>
          <LongLeftArrowIcon className={styles.backArrowIcon} />
          Back
        </ButtonLink>
        <h1 className={`${styles.title} ${editingStyles.title}`}>
          Edit common {common.name}
        </h1>
        <EditingForm
          common={common}
          onFinish={handleUpdatedCommon}
          onCancel={handleUpdatedCommonCancel}
        />
      </div>
    </Container>
  );
};

export default Editing;
