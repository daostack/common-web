import React, { FC, useMemo, useRef } from "react";
import { FieldArray, useFormikContext } from "formik";
import { Dropdown } from "@/shared/components/Form/Formik";
import { Modal } from "@/shared/components/Modal";
import { IntermediateCreateProjectPayload } from "@/shared/interfaces";
import { SpaceAdvancedSettingsIntermediate } from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { Checkbox } from "../../../Checkbox";
import { SYNCING_OPTIONS } from "./constants";
import styles from "./AdvancedSettingsModal.module.scss";

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCommonName?: string;
}

/**
 * TODO: need to handle hierarchy
 */

const AdvancedSettingsModal: FC<AdvancedSettingsModalProps> = (props) => {
  const { isOpen, onClose, parentCommonName } = props;
  const { values, setFieldValue } =
    useFormikContext<IntermediateCreateProjectPayload>();
  const advancedSettings = values.advancedSettings;

  const prevFormDataRef = useRef<SpaceAdvancedSettingsIntermediate | undefined>(
    values.advancedSettings,
  );

  const inheritedCircles = useMemo(
    () =>
      advancedSettings?.circles?.map((circle, index) => ({
        text: circle.inheritFrom?.circleName,
        value: circle.inheritFrom,
        key: String(index),
      })),
    [],
  );

  if (!advancedSettings) {
    return <span>Error loading advanced settings.</span>;
  }

  const cancel = () => {
    setFieldValue("advancedSettings", prevFormDataRef.current);
    onClose();
  };

  const apply = () => {
    prevFormDataRef.current = values.advancedSettings;
    onClose();
  };

  return (
    <Modal
      title="Advanced settings"
      isShowing={isOpen}
      onClose={cancel}
      styles={{ header: styles.modalHeader }}
    >
      <span>Roles</span>
      <FieldArray
        name="advancedSettings"
        render={() => (
          <>
            {advancedSettings.circles?.map((circle, index) => {
              return (
                <div key={index} className={styles.rootCircleWrapper}>
                  <Checkbox
                    id={`advancedSettings.circles.${index}.selected`}
                    name={`advancedSettings.circles.${index}.selected`}
                    label={circle.circleName}
                    disabled={
                      advancedSettings.circles &&
                      index === advancedSettings.circles?.length - 1
                    }
                  />

                  {circle.selected && (
                    <Dropdown
                      name={`advancedSettings.circles.${index}.synced`}
                      options={SYNCING_OPTIONS}
                      shouldBeFixed={false}
                      className={styles.dropdown}
                    />
                  )}

                  {circle.selected && circle.synced && (
                    <div className={styles.syncedWrapper}>
                      <b>with space</b>
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

            <Button
              onClick={apply}
              variant={ButtonVariant.PrimaryPink}
              className={styles.applyButton}
            >
              Apply
            </Button>
          </>
        )}
      />
    </Modal>
  );
};

export default AdvancedSettingsModal;
