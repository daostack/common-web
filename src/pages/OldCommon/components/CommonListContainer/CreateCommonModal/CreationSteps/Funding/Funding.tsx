import React, {
  useCallback,
  useRef,
  ChangeEventHandler,
  ReactElement,
  ReactNode,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { Button, Separator } from "@/shared/components";
import {
  Checkbox,
  CurrencyInput,
  Form,
  ToggleButtonGroup,
  ToggleButton,
} from "@/shared/components/Form/Formik";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import {
  ScreenSize,
  MIN_CONTRIBUTION_ILS_AMOUNT,
  ContributionType,
} from "@/shared/constants";
import { Currency } from "@/shared/models";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { commonTypeText, formatPrice } from "@/shared/utils";
import { IntermediateCreateCommonPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import validationSchema from "./validationSchema";
import "./index.scss";

const DEFAULT_CONTRIBUTION_AMOUNT = MIN_CONTRIBUTION_ILS_AMOUNT / 100;

interface FundingProps {
  currentStep: number;
  onFinish: (data: Partial<IntermediateCreateCommonPayload>) => void;
  creationData: IntermediateCreateCommonPayload;
  isSubCommonCreation: boolean;
}

interface FormValues {
  contributionType: ContributionType;
  minimumContribution?: number;
  isCommonJoinFree: boolean;
}

const getCurrencyInputLabel = (
  contributionType: ContributionType,
  isMobileView: boolean,
): ReactNode => {
  const contributionText =
    contributionType === ContributionType.OneTime ? "one-time" : "monthly";
  const additionalText =
    isMobileView && contributionType === ContributionType.Monthly
      ? ` (min. ${formatPrice(MIN_CONTRIBUTION_ILS_AMOUNT)})`
      : "";

  return (
    <>
      Minimum <strong>{contributionText}</strong> contribution{additionalText}
    </>
  );
};

const getCurrencyInputDescription = (
  contributionType: ContributionType,
  isMobileView: boolean,
  isSubCommonCreation,
): string => {
  const descriptionPieces = [
    `Set the minimum amount that new members will have to contribute in order to join this ${commonTypeText(
      isSubCommonCreation,
    )}.`,
  ];

  if (!isMobileView || contributionType !== ContributionType.Monthly) {
    descriptionPieces.push(
      `The minimum contribution allowed by credit card is ${formatPrice(
        MIN_CONTRIBUTION_ILS_AMOUNT,
      )}.`,
    );
  }

  return descriptionPieces.join(" ");
};

export default function Funding({
  currentStep,
  onFinish,
  creationData,
  isSubCommonCreation,
}: FundingProps): ReactElement {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const initialValues = useMemo(() => {
    const minFeeMonthly =
      creationData.memberAdmittanceOptions?.minFeeMonthly?.amount;
    const minFeeOneTime =
      creationData.memberAdmittanceOptions?.minFeeOneTime?.amount;
    return {
      minimumContribution: (minFeeMonthly || minFeeOneTime || 0) / 100,
      contributionType: minFeeMonthly
        ? ContributionType.Monthly
        : ContributionType.OneTime,
      isCommonJoinFree:
        creationData.memberAdmittanceOptions?.paymentMustGoThrough === undefined
          ? false
          : !creationData.memberAdmittanceOptions?.paymentMustGoThrough,
    };
  }, [creationData]);

  const handleContributionTypeChange = useCallback((value: unknown) => {
    if (
      value === ContributionType.OneTime &&
      formRef.current?.values.isCommonJoinFree
    ) {
      formRef.current.setFieldValue(
        "minimumContribution",
        DEFAULT_CONTRIBUTION_AMOUNT,
      );
    }

    formRef.current?.setFieldValue("isCommonJoinFree", false);
  }, []);

  const handleCheckboxChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((event) => {
    if (event.target.checked && formRef.current) {
      formRef.current.setFieldValue("minimumContribution", 0);
    }
  }, []);

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }, []);

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      const minContribution =
        (Number(values.minimumContribution) || DEFAULT_CONTRIBUTION_AMOUNT) *
        100;
      let memberAdmittanceOptions = {} as Omit<
        MemberAdmittanceLimitations,
        "paymentMustGoThrough"
      >;
      if (values.isCommonJoinFree) {
        memberAdmittanceOptions = {
          minFeeMonthly: null,
          minFeeOneTime: null,
        };
      } else {
        memberAdmittanceOptions =
          values.contributionType === ContributionType.Monthly
            ? {
                minFeeMonthly: {
                  amount: minContribution,
                  currency: Currency.ILS,
                },
                minFeeOneTime: null,
              }
            : {
                minFeeOneTime: {
                  amount: minContribution,
                  currency: Currency.ILS,
                },
                minFeeMonthly: null,
              };
      }

      onFinish({
        memberAdmittanceOptions: {
          ...memberAdmittanceOptions,
          paymentMustGoThrough: !values.isCommonJoinFree,
        },
      });
    },
    [onFinish],
  );

  const progressEl = (
    <Progress creationStep={currentStep} isSubCommonCreation={false} />
  );

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="create-common-funding">
        {isMobileView && progressEl}
        <Separator className="create-common-funding__separator" />
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
          validateOnMount
          validateOnChange
        >
          {({ values: { contributionType, isCommonJoinFree }, isValid }) => (
            <Form className="create-common-funding__form">
              <ToggleButtonGroup
                className="create-common-funding__field"
                name="contributionType"
                label="Contribution type"
                onChange={handleContributionTypeChange}
                styles={{ label: "create-common-funding__field-label" }}
              >
                <ToggleButton value={ContributionType.OneTime}>
                  One-time
                </ToggleButton>
                <ToggleButton value={ContributionType.Monthly}>
                  Monthly
                </ToggleButton>
              </ToggleButtonGroup>
              <CurrencyInput
                className="create-common-funding__field"
                id="minimumContribution"
                name="minimumContribution"
                label={getCurrencyInputLabel(contributionType, isMobileView)}
                description={getCurrencyInputDescription(
                  contributionType,
                  isMobileView,
                  isSubCommonCreation,
                )}
                placeholder={formatPrice(MIN_CONTRIBUTION_ILS_AMOUNT)}
                disabled={
                  contributionType === ContributionType.OneTime &&
                  isCommonJoinFree
                }
                allowDecimals={false}
                styles={{
                  label: "create-common-funding__field-label",
                  description:
                    "create-common-funding__currency-input-description",
                  error: "create-common-funding__currency-input-error",
                }}
              />
              {contributionType === ContributionType.OneTime && (
                <Checkbox
                  className="create-common-funding__field"
                  id="isCommonJoinFree"
                  name="isCommonJoinFree"
                  label={`Let users join the ${commonTypeText(
                    isSubCommonCreation,
                  )} without a personal contribution`}
                  onChange={handleCheckboxChange}
                  styles={{
                    label: "create-common-funding__checkbox-label",
                  }}
                />
              )}
              <ModalFooter sticky>
                <div className="create-common-funding__modal-footer">
                  <Button
                    key="funding-continue"
                    onClick={handleContinueClick}
                    shouldUseFullWidth={isMobileView}
                    disabled={!isValid}
                  >
                    Continue to Review
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
