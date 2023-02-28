import React, { FC, useCallback, useEffect, useMemo } from "react";
import classNames from "classnames";
import { Formik } from "formik";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { useCommonDataContext } from "@/pages/common/providers";
import { Modal } from "@/shared/components";
import {
  RadioButtonGroup,
  RadioButton,
  Select,
} from "@/shared/components/Form";
import { TextField } from "@/shared/components/Form/Formik";
import {
  CURRENCY_SELECT_OPTIONS,
  Orientation,
  RecipientType,
} from "@/shared/constants";
import { SelectType } from "@/shared/interfaces/Select";
import { Common, CommonMemberWithUserInfo, Currency } from "@/shared/models";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { Recipient } from "../AddRecipient/AddRecipient";
import { validationSchema } from "./validationSchema";
import styles from "./AddRecipientModal.module.scss";

export interface FormValues {
  recipientType: RecipientType;
  goalOfPayment: string;
  recipient: Common | CommonMemberWithUserInfo | null;
  currency: SelectType<Currency> | null;
  commonBalance: number;
  amount: number | null;
}

const INITIAL_VALUES = {
  recipientType: RecipientType.Member,
  goalOfPayment: "",
  recipient: {},
  currency: CURRENCY_SELECT_OPTIONS[0],
  commonBalance: 0,
  amount: null,
};

interface AddRecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    values: Recipient,
    recipientId: string,
    recipientType: RecipientType,
  ) => void;
}

const AddRecipientModal: FC<AddRecipientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    fetched: areCommonMembersFetched,
    data: commonMembers,
    fetchCommonMembers,
  } = useCommonMembers();
  const { common, subCommons, parentCommons } = useCommonDataContext();
  const commonId = useMemo(() => common.id, [common]);

  const initialValues = useMemo(
    () => ({
      ...INITIAL_VALUES,
      commonBalance: common.balance.amount,
    }),
    [common.balance],
  );

  useEffect(() => {
    if (commonId) {
      fetchCommonMembers(commonId);
    }
  }, [fetchCommonMembers, commonId]);

  const memberOptions = useMemo(() => {
    return (commonMembers || []).map((member) => ({
      ...member,
      value: member.id,
      label: `${member.user.firstName} ${member.user.lastName}`,
    }));
  }, [commonMembers]);

  const projectOptions = useMemo(() => {
    return [common, ...subCommons, ...parentCommons].map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
  }, [common, subCommons, parentCommons]);

  const getRecipientOptions = useCallback(
    (recipientType) => {
      switch (recipientType) {
        case RecipientType.Member:
          return memberOptions;
        case RecipientType.Projects:
          return projectOptions;
        default:
          return projectOptions;
      }
    },
    [projectOptions, memberOptions],
  );

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={onClose}
      title={<h3 className={styles.header}>Add recipient</h3>}
      mobileFullScreen
      isHeaderSticky
      styles={{
        headerWrapper: styles.modalHeaderWrapper,
        header: styles.modalHeader,
        content: styles.modalContent,
        closeWrapper: styles.closeWrapper,
      }}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values) => {
          const recipient =
            values.recipientType === RecipientType.Member
              ? `${
                  (values.recipient as CommonMemberWithUserInfo).user.firstName
                } ${
                  (values.recipient as CommonMemberWithUserInfo).user.lastName
                }`
              : (values.recipient as Common).name;
          onSubmit(
            {
              recipient,
              amount: (values.amount ?? 0) * 100,
              currency: values.currency.label,
              goalOfPayment: values.goalOfPayment,
            },
            (values.recipientType === RecipientType.Member
              ? (values.recipient as CommonMemberWithUserInfo).user.uid
              : (values.recipient as { id: string }).id) as string,
            values.recipientType,
          );
        }}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ values, isValid, setFieldValue }) => (
          <>
            <div className={styles.formContainer}>
              <TextField
                className={classNames(styles.field, styles.amountField)}
                id="amount"
                name="amount"
                label="Amount"
                type="number"
                styles={{
                  labelWrapper: styles.textFieldLabelWrapper,
                }}
              />
              <Select
                label="Currency"
                formName="currency"
                placeholder="Currency"
                options={CURRENCY_SELECT_OPTIONS}
                containerClassName={styles.currencySelectContainer}
              />
            </div>
            <RadioButtonGroup
              className={styles.recipientButtonGroup}
              label="Recipient Type"
              value={values.recipientType}
              onChange={(value) => {
                setFieldValue("recipientType", value);
                setFieldValue("recipient", null);
              }}
              variant={Orientation.Horizontal}
              styles={{
                buttons: styles.recipientButtons,
              }}
            >
              <RadioButton
                value={RecipientType.Member}
                checked={values.recipientType === RecipientType.Member}
              ></RadioButton>
              <RadioButton
                value={RecipientType.Projects}
                checked={values.recipientType === RecipientType.Projects}
              ></RadioButton>
              {/* <RadioButton
                value={RecipientType.ThirdParty}
                styles={toggleButtonStyles}
                checked={values.recipientType === RecipientType.ThirdParty}
              ></RadioButton> */}
            </RadioButtonGroup>
            <Select
              label="Select recipient"
              formName="recipient"
              placeholder="Recipient"
              options={getRecipientOptions(values.recipientType)}
              disabled={!areCommonMembersFetched}
            />
            <TextField
              className={classNames(styles.field, styles.goalOfPaymentField)}
              id="goalOfPayment"
              name="goalOfPayment"
              label="Goal of payment"
              styles={{
                labelWrapper: styles.textFieldLabelWrapper,
              }}
            />
            <div className={styles.buttonsWrapper}>
              <Button
                className={styles.button}
                variant={ButtonVariant.PrimaryGray}
                size={ButtonSize.Large}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className={styles.button}
                size={ButtonSize.Large}
                variant={ButtonVariant.LightPurple}
                type="submit"
                disabled={!isValid}
              >
                Save
              </Button>
            </div>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default AddRecipientModal;
