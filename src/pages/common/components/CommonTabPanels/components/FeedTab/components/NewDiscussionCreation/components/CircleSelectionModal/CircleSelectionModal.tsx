import React, { FC, useEffect, useState } from "react";
import { Dropdown, DropdownOption, Modal } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Circle, Governance } from "@/shared/models";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { addCirclesWithHigherTier } from "@/shared/utils";
import { getCircleNamesAsString } from "./utils";
import styles from "./CircleSelectionModal.module.scss";

interface CircleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (circle: Circle) => void;
  initialCircleId?: string;
  governanceCircles: Governance["circles"];
  userCircleIds?: string[];
}

const CircleSelectionModal: FC<CircleSelectionModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    onSave,
    initialCircleId = null,
    userCircleIds = [],
  } = props;
  const isTabletView = useIsTabletView();
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(
    initialCircleId,
  );
  const governanceCircles = Object.values(props.governanceCircles);
  const circleOptions: DropdownOption[] = governanceCircles
    .filter((circle) => userCircleIds.includes(circle.id))
    .map((circle) => ({
      text: circle.name,
      searchText: circle.name,
      value: circle.id,
    }));
  const selectedCircle = governanceCircles.find(
    (circle) => circle.id === selectedCircleId,
  );
  const circlesForHint = selectedCircle
    ? addCirclesWithHigherTier(
        [selectedCircle],
        governanceCircles,
        userCircleIds,
      ).filter((circle) => circle.id !== selectedCircleId)
    : [];
  const buttonSize = isTabletView ? ButtonSize.Large : ButtonSize.Medium;

  const handleCircleSelect = (value: unknown) => {
    setSelectedCircleId(value as string);
  };

  const handleSave = () => {
    if (selectedCircle) {
      onSave(selectedCircle);
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedCircleId(null);
    } else {
      setSelectedCircleId(initialCircleId);
    }
  }, [isOpen]);

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={onClose}
      title={
        <div className={styles.modalTitleWrapper}>
          <h3 className={styles.modalTitle}>Private to a circle</h3>
          <p className={styles.modalSubTitle}>
            Choose a circle that could view and participate in the discussion
          </p>
        </div>
      }
      styles={{
        header: styles.modalHeader,
        closeWrapper: styles.closeWrapper,
      }}
    >
      <div className={styles.modalContent}>
        <Dropdown
          options={circleOptions}
          value={selectedCircleId}
          onSelect={handleCircleSelect}
          label="Circle"
          placeholder="Select Circle"
          shouldBeFixed={false}
        />
        {circlesForHint.length > 0 && (
          <span className={styles.hint}>
            {getCircleNamesAsString(
              circlesForHint.map((circle) => circle.name),
            )}{" "}
            {circlesForHint.length === 1 ? `is` : `are`} automatically included.
          </span>
        )}
        <div className={styles.buttonsContainer}>
          <div className={styles.buttonsWrapper}>
            <Button
              className={styles.button}
              variant={ButtonVariant.PrimaryGray}
              size={buttonSize}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className={styles.button}
              size={buttonSize}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CircleSelectionModal;
