import React, { FC, useMemo } from "react";
import { FieldArray, useFormikContext } from "formik";
import { Dropdown } from "@/shared/components/Form/Formik";
import { Modal } from "@/shared/components/Modal";
import { SpaceAdvancedSettingsIntermediate } from "@/shared/models";
import { Checkbox } from "../../../Checkbox";
import { SYNCED_UNSYNCED_OPTIONS } from "./constants";
import styles from "./AdvancedSettingsModal.module.scss";

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCommonName?: string;
}

const AdvancedSettingsModal: FC<AdvancedSettingsModalProps> = (props) => {
  const { isOpen, onClose, parentCommonName } = props;
  const { values } = useFormikContext();

  const advancedSettings: SpaceAdvancedSettingsIntermediate = (values as any)
    .advancedSettings;
  console.log(advancedSettings);

  const inheritedCircles = useMemo(() => {
    return advancedSettings.circles?.map((circle) => {
      return {
        text: circle.inheritFrom?.circleName,
        value: circle.inheritFrom,
      };
    });
  }, [advancedSettings.circles]);

  return (
    <Modal title="Advanced settings" isShowing={isOpen} onClose={onClose}>
      <FieldArray
        name="advancedSettings"
        render={() => {
          return (
            <div>
              {advancedSettings.circles?.map((circle, index) => {
                return (
                  <div key={index} className={styles.rootCircleWrapper}>
                    <Checkbox
                      id={`advancedSettings.circles.${index}.selected`}
                      name={`advancedSettings.circles.${index}.selected`}
                      label={circle.circleName}
                    />

                    {circle.selected && (
                      <Dropdown
                        name={`advancedSettings.circles.${index}.synced`}
                        options={SYNCED_UNSYNCED_OPTIONS}
                        shouldBeFixed={false}
                        className={styles.dropdown}
                      />
                    )}

                    {circle.selected && circle.synced && (
                      <div className={styles.syncedWrapper}>
                        <b>wite space</b>
                        <span className={styles.parentSpaceNameLabel}>
                          {parentCommonName}
                        </span>
                        <b>role</b>
                        <Dropdown
                          name={`advancedSettings.circles.${index}.inheritFrom`}
                          options={inheritedCircles || []}
                          shouldBeFixed={false}
                          className={styles.dropdown}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }}
      />
    </Modal>
  );
};

export default AdvancedSettingsModal;
