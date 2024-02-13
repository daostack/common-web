import React, { FC, useMemo, useRef } from "react";
import { FieldArray, useFormikContext } from "formik";
import { min, max } from "lodash";
import { Option } from "@/shared/components/Dropdown/Dropdown";
import { Dropdown } from "@/shared/components/Form/Formik";
import { Modal } from "@/shared/components/Modal";
import { IntermediateCreateProjectPayload } from "@/shared/interfaces";
import {
  SpaceAdvancedSettingsIntermediate,
  InheritFromCircle,
} from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { Checkbox } from "../../../Checkbox";
import { SYNCING_OPTIONS } from "./constants";
import { getCirclesTiers, getInheritCirclesOptions } from "./utils";
import styles from "./AdvancedSettingsModal.module.scss";

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCommonName?: string;
}

interface AdvancedSettingsOption extends Option {
  text: string;
  value: InheritFromCircle;
  key: string;
}

/**
 * TODO: need to handle hierarchy
 */

const TIER_GAP = 10;

const AdvancedSettingsModal: FC<AdvancedSettingsModalProps> = (props) => {
  const { isOpen, onClose, parentCommonName } = props;
  const { values, setFieldValue } =
    useFormikContext<IntermediateCreateProjectPayload>();
  const advancedSettings = values.advancedSettings;
  const initialAdvancedSettings = values.initialAdvancedSettings;

  const prevFormDataRef = useRef<SpaceAdvancedSettingsIntermediate | undefined>(
    values.advancedSettings,
  );

  const [minTier, maxTier] = useMemo(() => {
    if (!initialAdvancedSettings) {
      return [];
    }

    const tierList = (initialAdvancedSettings?.circles ?? []).map(
      (circle) => circle?.inheritFrom?.tier,
    );
    return [min(tierList), max(tierList)];
  }, [initialAdvancedSettings]);

  const inheritedCircles: AdvancedSettingsOption[] = useMemo(
    () =>
      (initialAdvancedSettings?.circles ?? []).map((circle, index) => ({
        text: circle.inheritFrom?.circleName as string,
        value: circle.inheritFrom as InheritFromCircle,
        key: String(index),
      })),
    [initialAdvancedSettings],
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

  const onChangeInheritCircle = (index: number) => (value: unknown) => {
    const newTier = (value as InheritFromCircle).tier;
    const initialTier =
      initialAdvancedSettings?.circles?.[index]?.inheritFrom?.tier;

    if (newTier !== initialTier) {
      const circles = initialAdvancedSettings?.circles || [];
      const newCircleIndex =
        circles.findIndex((circle) => circle.inheritFrom?.tier === newTier) ??
        0;

      if (newCircleIndex <= 0) {
        return;
      }

      if (index > newCircleIndex) {
        const newInheritFrom =
          advancedSettings?.circles?.[newCircleIndex - 1]?.inheritFrom;
        setFieldValue(
          `advancedSettings.circles.${newCircleIndex}.inheritFrom`,
          newInheritFrom,
        );
      } else {
        const newInheritFrom =
          advancedSettings?.circles?.[newCircleIndex + 1]?.inheritFrom;
        setFieldValue(
          `advancedSettings.circles.${newCircleIndex}.inheritFrom`,
          newInheritFrom,
        );
      }
    }
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
              const advancedCircles = advancedSettings.circles || [];
              const previousCircles = getCirclesTiers(
                advancedCircles.slice(0, index),
              );
              const previousCirclesTierMax = Number(max(previousCircles));

              const nextCircles = getCirclesTiers(
                advancedCircles.slice(index + 1),
              );
              const nextCirclesTierMin = Number(min(nextCircles));

              const inheritCirclesOptions = getInheritCirclesOptions({
                inheritedCircles: inheritedCircles ?? [],
                previousCirclesTierMax,
                nextCirclesTierMin,
              });
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
                      disabled={
                        previousCirclesTierMax === maxTier ||
                        nextCirclesTierMin === minTier ||
                        previousCirclesTierMax + TIER_GAP === nextCirclesTierMin
                      }
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
                        options={inheritCirclesOptions || []}
                        shouldBeFixed={false}
                        className={styles.dropdown}
                        onSelect={onChangeInheritCircle(index)}
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
