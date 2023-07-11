import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Formik } from "formik";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { CommonService } from "@/services";
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
import { SelectOptionType } from "@/shared/interfaces/Select";
import {
  Common,
  CommonMember,
  CommonMemberWithUserInfo,
  Currency,
} from "@/shared/models";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { useNewProposalCreationContext } from "../../context";
import { validationSchema } from "./validationSchema";
import styles from "./AddRecipientModal.module.scss";

export interface FormValues {
  recipientType: RecipientType;
  goalOfPayment: string;
  recipient: Common | CommonMemberWithUserInfo | null;
  currency: SelectOptionType | null;
  commonBalance: number;
  amount: number | null;
}

const INITIAL_VALUES = {
  recipientType: RecipientType.Member,
  goalOfPayment: "",
  recipient: null,
  currency: CURRENCY_SELECT_OPTIONS[0],
  commonBalance: 0,
  amount: null,
};

interface AddRecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  initData?: FormValues;
}

const AddRecipientModal: FC<AddRecipientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initData,
}) => {
  const {
    fetched: areCommonMembersFetched,
    data: commonMembers,
    fetchCommonMembers,
  } = useCommonMembers();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { common, subCommons, parentCommons } = useNewProposalCreationContext();
  const commonId = useMemo(() => common.id, [common]);

  const initialValues = useMemo(
    () => ({
      ...INITIAL_VALUES,
      commonBalance: common.balance.amount,
      ...initData,
    }),
    [common.balance, initData],
  );

  useEffect(() => {
    if (commonId) {
      fetchCommonMembers(commonId);
    }
  }, [fetchCommonMembers, commonId]);

  const memberOptions = useMemo(() => {
    return (commonMembers || [])
      .map((member) => ({
        ...member,
        value: member.id,
        label: `${member.user.firstName} ${member.user.lastName} ${
          userId === member.userId ? "(me)" : ""
        }`,
      }))
      .sort((a, b) => {
        if (userId === a.userId) {
          return -1;
        } else if (userId === b.userId) {
          return 1;
        }

        if (b.label > a.label) {
          return -1;
        } else if (b.label < a.label) {
          return 1;
        }

        return 0;
      });
  }, [commonMembers, userId]);

  const [commonsWithCommonMembers, setCommonsWithCommonMembers] = useState<
    (Common & { commonMember: CommonMember })[]
  >([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    (async () => {
      const updatedCommonsWithCommonMembers = (await Promise.all(
        [common, ...subCommons, ...parentCommons].map(async (item) => {
          const commonMember = await CommonService.getCommonMemberByUserId(
            item.id,
            userId,
          );

          return {
            ...item,
            value: item.id,
            label: item.name,
            commonMember,
          };
        }),
      )) as (Common & { commonMember: CommonMember })[];
      setCommonsWithCommonMembers(updatedCommonsWithCommonMembers);
    })();
  }, [common, subCommons, parentCommons, userId]);

  const projectOptions = useMemo(() => {
    if (!userId) {
      return [];
    }

    return commonsWithCommonMembers.filter(
      ({ commonMember, directParent }) => commonMember && directParent,
    );
  }, [commonsWithCommonMembers]);

  const getRecipientOptions = useCallback(
    (recipientType) => {
      switch (recipientType) {
        case RecipientType.Member:
          return memberOptions;
        case RecipientType.Spaces:
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
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ values, isValid, setFieldValue, handleSubmit }) => (
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
                isOptionDisabled={(option) => option?.value === Currency.USD}
                menuPortalTarget={document.body}
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
                value={RecipientType.Spaces}
                checked={values.recipientType === RecipientType.Spaces}
                isDisabled={projectOptions.length === 0}
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
              options={
                getRecipientOptions(values.recipientType) as Record<
                  string,
                  unknown
                >[]
              }
              disabled={!areCommonMembersFetched}
              menuPortalTarget={document.body}
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
                variant={ButtonVariant.OutlineDarkPink}
                size={ButtonSize.Large}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className={styles.button}
                size={ButtonSize.Large}
                variant={ButtonVariant.PrimaryPink}
                onClick={() => handleSubmit()}
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
