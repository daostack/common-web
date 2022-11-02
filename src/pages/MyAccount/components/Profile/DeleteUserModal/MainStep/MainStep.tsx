import React, { ChangeEventHandler, FC, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { UserMembershipInfo } from "@/pages/Common/interfaces";
import { Button, ButtonVariant } from "@/shared/components";
import { Checkbox, ErrorText, Input } from "@/shared/components/Form";
import { ErrorCode } from "@/shared/constants";
import { getUserName } from "@/shared/utils";
import { DeleteError, LeaveCommonErrors } from "../types";
import "./index.scss";

interface MainStepProps {
  isLoading: boolean;
  errorText: string;
  errors: DeleteError[];
  userMembershipInfo: UserMembershipInfo[];
  onDelete: () => void;
  onCancel: () => void;
}

const ERROR_CODE_TO_TEXT_MAP: Record<LeaveCommonErrors, string> = {
  [ErrorCode.LastMember]:
    "It turns out that you are the only member in this common. A common cannot be left empty, so you will have to close it. Please use the Delete Common action.",
  [ErrorCode.LastInCriticalCircle]:
    "You are the only member in this common with permission to some essential actions defined in your circle. Please assign another member to this circle in order to leave it.",
  [ErrorCode.UserHasOpenProposals]:
    "You have active proposals in this common. Please wait until they are closed.",
};

const MainStep: FC<MainStepProps> = (props) => {
  const {
    isLoading,
    errorText,
    errors,
    userMembershipInfo,
    onDelete,
    onCancel,
  } = props;
  const [userName, setUserName] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const user = useSelector(selectUser());
  const membershipInfo = useMemo(
    () =>
      userMembershipInfo.map(({ common, governance, commonMember }) => {
        const circlesString = Object.values(governance.circles)
          .filter(({ id }) =>
            Object.values(commonMember.circles.map).includes(id),
          )
          .map(({ name }) => name)
          .join(", ");

        return {
          circlesString,
          commonName: common.name,
        };
      }),
    [userMembershipInfo],
  );
  const isDeleteButtonDisabled =
    isLoading || !isApproved || userName !== getUserName(user);

  const handleUserNameChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setUserName(event.target.value);
  };

  const handleApprovalChange = () => {
    setIsApproved((value) => !value);
  };

  return (
    <div className="delete-user-main-step">
      <Input
        className="delete-user-main-step__user-name-input"
        id="userName"
        name="userName"
        label="Add your Name"
        autoFocus
        value={userName}
        onChange={handleUserNameChange}
        disabled={isLoading}
        styles={{
          label: "delete-user-main-step__input-label",
        }}
      />
      <p className="delete-user-main-step__text">
        You have asked to delete your user in the Common App. In order to remove
        your user the following conditions must be met:
      </p>
      <p className="delete-user-main-step__text">
        This action is reversible. Please note that all your past activities
        will still be shown in the Commons.
      </p>
      <div className="delete-user-main-step__list-wrapper">
        <h4 className="delete-user-main-step__list-title">
          Please review your memberships in the commons
        </h4>
        {membershipInfo.length > 0 ? (
          <ol className="delete-user-main-step__ordered-list">
            {membershipInfo.map(({ commonName, circlesString }) => (
              <li key={commonName}>
                {commonName} - {circlesString}
              </li>
            ))}
          </ol>
        ) : (
          <p className="delete-user-main-step__text">
            You don’t have any memberships.
          </p>
        )}
      </div>
      <ol className="delete-user-main-step__ordered-list">
        <li>
          You will no longer have access to all the Commons’ proposals,
          discussion, wallet transactions etc. either as reader or writer
          according to the Common’s governance
        </li>
        <li>
          Proposals that are assigned to you (funds transfer, circles) will be
          cancelled
        </li>
        <li>You will be removed from the Common’s members list</li>
        <li>Your monthly contributions will no longer be charged</li>
      </ol>
      <Checkbox
        className="delete-user-main-step__checkbox"
        name="infoApproval"
        label="I understand and approve"
        checked={isApproved}
        onChange={handleApprovalChange}
        disabled={isLoading}
        styles={{
          label: "delete-user-main-step__checkbox-label",
        }}
      />
      {errors.length > 0 ? (
        <div>
          <ErrorText className="delete-user-main-step__error-text">
            There are some errors you have to fix in order to delete your
            account:
          </ErrorText>
          <ul className="delete-user-main-step__error-list">
            {errors.map((error) => (
              <li
                key={error.commonId}
                className="delete-user-main-step__error-list-item"
              >
                <h4 className="delete-user-main-step__error-item-title">
                  {error.commonName}
                </h4>
                <ul>
                  {error.errorCodes.map((errorCode) => (
                    <li key={errorCode}>{ERROR_CODE_TO_TEXT_MAP[errorCode]}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ErrorText className="delete-user-main-step__error-text">
          {errorText}
        </ErrorText>
      )}
      <div className="delete-user-main-step__buttons-wrapper">
        <Button
          className="delete-user-main-step__button"
          onClick={onCancel}
          variant={ButtonVariant.Secondary}
          disabled={isLoading}
          shouldUseFullWidth
        >
          Cancel
        </Button>
        <Button
          className="delete-user-main-step__button"
          onClick={onDelete}
          disabled={isDeleteButtonDisabled}
          shouldUseFullWidth
        >
          Delete me
        </Button>
      </div>
    </div>
  );
};

export default MainStep;
