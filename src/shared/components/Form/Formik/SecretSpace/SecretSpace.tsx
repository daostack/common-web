import React, { FC } from "react";
import { useFormikContext } from "formik";
import {
  ToggleSwitch,
  ToggleSwitchVariant,
} from "@/shared/components/ToggleSwitch/ToggleSwitch";
import {
  IntermediateCreateProjectPayload,
  SpaceListVisibility,
} from "@/shared/interfaces";
import styles from "./SecretSpace.module.scss";

export const SecretSpace: FC = () => {
  const { values, setFieldValue } =
    useFormikContext<IntermediateCreateProjectPayload>();
  const listVisibility = values.listVisibility ?? SpaceListVisibility.Public;

  return (
    <div className={styles.container}>
      <ToggleSwitch
        variant={ToggleSwitchVariant.Pink}
        label="Secret space"
        isChecked={listVisibility === SpaceListVisibility.Members}
        onChange={(toggleState) => {
          setFieldValue(
            "listVisibility",
            toggleState
              ? SpaceListVisibility.Members
              : SpaceListVisibility.Public,
          );
        }}
      />
      {listVisibility === SpaceListVisibility.Members && (
        <p className={styles.secretChatLabel}>
          Only members of this space will be able to see it.
        </p>
      )}
    </div>
  );
};
