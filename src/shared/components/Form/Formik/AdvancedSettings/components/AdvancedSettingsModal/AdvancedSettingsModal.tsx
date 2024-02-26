import React, { FC, useMemo, useRef } from "react";
import classNames from "classnames";
import { FieldArray, useFormikContext } from "formik";
import { min, max, uniqBy } from "lodash";
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
      uniqBy(
        (initialAdvancedSettings?.circles ?? [])
          .map((circle, index) => ({
            text: circle.inheritFrom?.circleName as string,
            value: circle.inheritFrom as InheritFromCircle,
            key: String(index),
          }))
          .filter(({ text }) => text),
        "text",
      ),
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

  const onResetCircleValue = (index: number): void => {
    const currentTier = advancedSettings.circles?.[index].inheritFrom?.tier;
    const initialTier =
      initialAdvancedSettings?.circles?.[index].inheritFrom?.tier;

    if (currentTier !== initialTier) {
      const initialCircleIndex = initialAdvancedSettings?.circles?.findIndex(
        (circle) => circle?.inheritFrom?.tier === currentTier,
      ) as number;
      if (!advancedSettings?.circles?.[initialCircleIndex].synced) {
        setFieldValue(
          `advancedSettings.circles.${initialCircleIndex}`,
          initialAdvancedSettings?.circles?.[initialCircleIndex],
        );
      }
    }

    setFieldValue(`advancedSettings.circles.${index}`, {
      ...initialAdvancedSettings?.circles?.[index],
      synced: false,
    });
  };

  const onChangeSelectedCircles =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.checked) {
        onResetCircleValue(index);
      }
    };

  const onChangeSyncedCircle = (index: number) => (isSynced: unknown) => {
    if (!isSynced) {
      onResetCircleValue(index);
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
              const currentCircleTier = circle?.inheritFrom?.tier;
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

              const hasLimits =
                !Number.isNaN(previousCirclesTierMax) &&
                !Number.isNaN(nextCirclesTierMin);

              const isPreviousCircleTierEqualToMaxTier = previousCirclesTierMax === maxTier;
              const isNextCircleTierEqualToMinTier = nextCirclesTierMin === minTier;
              const hasNoGapBetweenTiers = previousCirclesTierMax + TIER_GAP === nextCirclesTierMin;

              const isSyncOptionDisabled =
                isPreviousCircleTierEqualToMaxTier ||
                isNextCircleTierEqualToMinTier ||
                hasNoGapBetweenTiers ||
                (currentCircleTier === previousCirclesTierMax &&
                  hasLimits) ||
                (currentCircleTier === nextCirclesTierMin &&
                  hasLimits)
                ;

              return (
                <div key={index} className={styles.rootCircleWrapper}>
                  <div className={styles.rowContentWrapper}>
                    <Checkbox
                      id={`advancedSettings.circles.${index}.selected`}
                      name={`advancedSettings.circles.${index}.selected`}
                      label={circle.circleName}
                      disabled={
                        advancedSettings.circles &&
                        index === advancedSettings.circles?.length - 1
                      }
                      onChange={onChangeSelectedCircles(index)}
                    />

                    {circle.selected && (
                      <Dropdown
                        name={`advancedSettings.circles.${index}.synced`}
                        options={SYNCING_OPTIONS}
                        shouldBeFixed={false}
                        className={styles.dropdown}
                        disabled={isSyncOptionDisabled}
                        onSelect={onChangeSyncedCircle(index)}
                      />
                    )}
                  </div>
                  {circle.selected && circle.synced && (
                    <>
                      <div
                        className={classNames(
                          styles.rowContentWrapper,
                          styles.rowContentText,
                        )}
                      >
                        <b>with space</b>
                        <span className={styles.parentSpaceNameLabel}>
                          {parentCommonName}
                        </span>
                      </div>
                      <div
                        className={classNames(
                          styles.rowContentWrapper,
                          styles.rowContentText,
                        )}
                      >
                        <b>role</b>
                        <Dropdown
                          autoSelect
                          name={`advancedSettings.circles.${index}.inheritFrom`}
                          options={inheritCirclesOptions || []}
                          shouldBeFixed={false}
                          className={styles.dropdown}
                          onSelect={(value) => {
                            onChangeInheritCircle(index)(value);
                          }}
                        />
                      </div>
                    </>
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
