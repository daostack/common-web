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
              const previousCircles = advancedSettings.circles
                ?.slice(0, index)
                .reduce((acc, obj) => {
                  if (
                    obj.synced &&
                    obj.inheritFrom &&
                    Number.isInteger(obj?.inheritFrom?.tier)
                  ) {
                    acc.push(obj.inheritFrom.tier as number);
                  }
                  return acc;
                }, [] as number[]);
              const prevCirclesMax = Number(max(previousCircles));
              const nextCircles = advancedSettings.circles
                ?.slice(index + 1, advancedSettings.circles.length)
                .reduce((acc, obj) => {
                  if (
                    obj.synced &&
                    obj.inheritFrom &&
                    Number.isInteger(obj?.inheritFrom?.tier)
                  ) {
                    acc.push(obj.inheritFrom.tier as number);
                  }
                  return acc;
                }, [] as number[]);

              const nextCirclesMin = Number(min(nextCircles));

              const inheritCirclesOptions = inheritedCircles?.reduce(
                (acc, inheritCircle) => {
                  const tier = Number(inheritCircle.value?.tier);
                  if (
                    Number.isInteger(tier) &&
                    (tier <= prevCirclesMax || tier >= nextCirclesMin)
                  ) {
                    return acc;
                  }

                  acc.push(inheritCircle);
                  return acc;
                },
                [] as AdvancedSettingsOption[],
              );

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
                        prevCirclesMax === maxTier ||
                        nextCirclesMin === minTier ||
                        prevCirclesMax + TIER_GAP === nextCirclesMin
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
                        onSelect={(val) => {
                          const tier = (val as InheritFromCircle).tier;
                          if (
                            tier !==
                            initialAdvancedSettings?.circles?.[index]
                              .inheritFrom?.tier
                          ) {
                            const newCircleIndex =
                              initialAdvancedSettings?.circles?.findIndex(
                                (circle) => circle.inheritFrom?.tier === tier,
                              ) ?? 0;

                            if (newCircleIndex > 0 && index > newCircleIndex) {
                              setFieldValue(
                                `advancedSettings.circles.${newCircleIndex}.inheritFrom`,
                                advancedSettings?.circles?.[newCircleIndex - 1]
                                  .inheritFrom,
                              );
                            }
                          }
                        }}
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
