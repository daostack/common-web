import React, { FC } from "react";
import classNames from "classnames";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { UnstructuredRules } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { isRTL } from "@/shared/utils";
import { CommonCard } from "../../../../../CommonCard";
import styles from "./CommonRules.module.scss";

interface CommonRulesProps {
  rules: UnstructuredRules;
}

const CommonRules: FC<CommonRulesProps> = (props) => {
  const { rules } = props;
  const isTabletView = useIsTabletView();

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      <CommonCard hideCardStyles={isTabletView}>
        <h3 className={styles.title}>Common Rules</h3>
        <dl className={styles.list}>
          {rules.map((rule, index) => (
            <div
              key={index}
              className={classNames(styles.item, {
                [styles.itemRTL]: isRTL(rule.title) || isRTL(rule.definition),
              })}
            >
              <dt className={styles.itemTitle}>{rule.title}</dt>
              <dd className={styles.itemDescription}>{rule.definition}</dd>
            </div>
          ))}
        </dl>
      </CommonCard>
    </Container>
  );
};

export default CommonRules;
