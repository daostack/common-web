import React, { FC } from "react";
import config from "@/config";
import { Button } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import "./index.scss";
import { useHistory } from "react-router-dom";

const Success: FC = () => {
  const history = useHistory();

  const handleJumpIn = () => {
    history.push(
      ROUTE_PATHS.COMMON_DETAIL.replace(":id", config.deadSeaCommonId)
    );
  };

  return (
    <div className="dead-sea-success">
      <h1 className="dead-sea-success__title">Welcome</h1>
      <p className="dead-sea-success__paragraph-1">
        You’re now a supporter member of the Dead Sea Guardians Common.
      </p>
      <p className="dead-sea-success__paragraph-2">
        The Common is a shared space for the Dead Sea Guardians Supporters
        Community. Common members discuss and vote on decisions and expenses.
        For more details on how to take active part in the Common check the
        Agenda.
      </p>
      <Button
        className="dead-sea-success__submit-button"
        onClick={handleJumpIn}
        shouldUseFullWidth
      >
        Jump In
      </Button>
    </div>
  );
};

export default Success;
