import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
import { Button } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import "./index.scss";

const Welcome: FC = () => {
  const history = useHistory();
  const { supportersData } = useSupportersDataContext();

  const handleJumpIn = () => {
    if (supportersData) {
      history.push(
        ROUTE_PATHS.COMMON_DETAIL.replace(":id", supportersData.commonId)
      );
    }
  };

  return (
    <div className="supporters-page-welcome">
      <h1 className="supporters-page-welcome__title">Welcome</h1>
      <p className="supporters-page-welcome__paragraph-1">
        You’re now a supporter member of the Dead Sea Guardians Common.
      </p>
      <p className="supporters-page-welcome__paragraph-2">
        The Common is a shared space for the Dead Sea Guardians Supporters
        Community. Common members discuss and vote on decisions and expenses.
        For more details on how to take active part in the Common check the
        Agenda.
      </p>
      <Button
        className="supporters-page-welcome__submit-button"
        onClick={handleJumpIn}
        shouldUseFullWidth
      >
        Jump In
      </Button>
    </div>
  );
};

export default Welcome;
