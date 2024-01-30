import React, { FC, useMemo } from "react";
import { FieldArray, useFormikContext } from "formik";
import { Dropdown } from "@/shared/components/Form/Formik";
import { Modal } from "@/shared/components/Modal";
import { IntermediateCreateProjectPayload } from "@/shared/interfaces";
import { Checkbox } from "../../../Checkbox";
import { SYNCED_UNSYNCED_OPTIONS } from "./constants";
import styles from "./AdvancedSettingsModal.module.scss";

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCommonName?: string;
}

/**
 * TODO
 * 1. fix z-index of dropdown
 * 2. need apply button to keep recent changes, otherwise need to bring back the initial settings.
 * 3. need to understand why after cliking a role in the dropdown, they are duplicated.
 */

const AdvancedSettingsModal: FC<AdvancedSettingsModalProps> = (props) => {
  const { isOpen, onClose, parentCommonName } = props;
  const { values, setFieldValue } =
    useFormikContext<IntermediateCreateProjectPayload>();
  const advancedSettings = values.advancedSettings;

  //const initialValues = useMemo(() => (values.advancedSettings), []);

  if (!advancedSettings) {
    return <span>Error</span>;
  }

  const inheritedCircles = useMemo(
    () =>
      advancedSettings.circles?.map((circle) => ({
        text: circle.inheritFrom?.circleName,
        value: circle.inheritFrom,
      })),
    [advancedSettings.circles],
  );

  return (
    <Modal title="Advanced settings" isShowing={isOpen} onClose={onClose}>
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
          </>
        )}
      />
    </Modal>
  );
};

export default AdvancedSettingsModal;
