import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useSupportersDataContext } from "@/pages/Common/containers/SupportersContainer/context";
import { Button, Loader } from "@/shared/components";
import { Checkbox } from "@/shared/components/Form";
import { ROUTE_PATHS } from "@/shared/constants";
import { useGovernance } from "@/shared/hooks/useCases";
import "./index.scss";

interface WelcomeProps {
  governanceId: string;
}

const Welcome: FC<WelcomeProps> = (props) => {
  const { governanceId } = props;
  const history = useHistory();
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters",
  });
  const { supportersData, currentTranslation } = useSupportersDataContext();
  const {
    data: governance,
    fetched: isGovernanceFetched,
    fetchGovernance,
  } = useGovernance();
  const [areRulesApproved, setAreRulesApproved] = useState(false);

  const handleJumpIn = () => {
    if (supportersData) {
      history.push(
        ROUTE_PATHS.COMMON_DETAIL.replace(":id", supportersData.commonId),
      );
    }
  };

  const handleRulesApprovalChange = () => {
    setAreRulesApproved((value) => !value);
  };

  useEffect(() => {
    fetchGovernance(governanceId);
  }, [governanceId]);

  if (!isGovernanceFetched) {
    return <Loader />;
  }

  return (
    <div className="supporters-page-welcome">
      <h1 className="supporters-page-welcome__title">{t("welcome.title")}</h1>
      <p className="supporters-page-welcome__description">
        {currentTranslation?.welcomePageDescription}
      </p>
      <p className="supporters-page-welcome__rules-description">
        {currentTranslation?.welcomePageRulesDescription}
      </p>
      <h2 className="supporters-page-welcome__rules-title">
        {t("welcome.rulesTitle")}
      </h2>
      <ul className="supporters-page-welcome__rule-list">
        {(governance?.unstructuredRules || []).map((rule, index) => (
          <li key={index} className="supporters-page-welcome__rule-list-item">
            <h3 className="supporters-page-welcome__rule-title">
              {rule.title}
            </h3>
            <p className="supporters-page-welcome__rule-description">
              {rule.definition}
            </p>
          </li>
        ))}
      </ul>
      <Checkbox
        className="supporters-page-welcome__rules-approval-checkbox"
        name="rulesApproval"
        label={t("welcome.rulesApproval")}
        checked={areRulesApproved}
        onChange={handleRulesApprovalChange}
      />
      <Button
        className="supporters-page-welcome__submit-button"
        onClick={handleJumpIn}
        disabled={!areRulesApproved}
        shouldUseFullWidth
      >
        {t("buttons.jumpIn")}
      </Button>
    </div>
  );
};

export default Welcome;
