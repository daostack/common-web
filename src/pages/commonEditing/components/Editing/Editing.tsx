import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { updateCommonState } from "@/pages/OldCommon/store/actions";
import { CenterWrapper } from "@/pages/commonCreation/components";
import { styles } from "@/pages/commonCreation/components/ProjectCreation";
import { GovernanceActions } from "@/shared/constants";
import { LongLeftArrowIcon } from "@/shared/icons";
import { Common } from "@/shared/models";
import { Container, Loader } from "@/shared/ui-kit";
import { getCommonPageAboutTabPath } from "@/shared/utils";
import { commonLayoutActions, projectsActions } from "@/store/states";
import { EditingForm } from "./components";
import editingStyles from "./Editing.module.scss";

interface EditingProps {
  common: Common;
}

const Editing: FC<EditingProps> = (props) => {
  const { common } = props;
  const history = useHistory();
  const dispatch = useDispatch();
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

  const handleUpdatedCommon = (updatedCommon: Common) => {
    const data = {
      commonId: updatedCommon.id,
      image: updatedCommon.image,
      name: updatedCommon.name,
    };
    dispatch(commonLayoutActions.updateCommonOrProject(data));
    dispatch(projectsActions.updateProject(data));
    dispatch(
      updateCommonState({
        commonId: updatedCommon.id,
        state: {
          loading: false,
          fetched: true,
          data: updatedCommon,
        },
      }),
    );
    history.push(getCommonPageAboutTabPath(updatedCommon.id));
  };

  useEffect(() => {
    fetchCommonMember(common.id, {}, true);
  }, [common.id, userId]);

  if (!isCommonMemberFetched) {
    return loaderEl;
  }

  const backRoute = getCommonPageAboutTabPath(common.id);

  if (
    !commonMember ||
    !commonMember.allowedActions[GovernanceActions.UPDATE_COMMON]
  ) {
    return <Redirect to={backRoute} />;
  }

  const handleProjectCreationCancel = () => {
    history.push(backRoute);
  };

  return (
    <Container className={styles.container}>
      <div className={styles.content}>
        <NavLink className={styles.backLink} to={backRoute}>
          <LongLeftArrowIcon className={styles.backArrowIcon} />
          Back
        </NavLink>
        <h1 className={`${styles.title} ${editingStyles.title}`}>
          Edit common {common.name}
        </h1>
        <EditingForm
          common={common}
          onFinish={handleUpdatedCommon}
          onCancel={handleProjectCreationCancel}
        />
      </div>
    </Container>
  );
};

export default Editing;
