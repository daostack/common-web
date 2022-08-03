import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { useDispatch, useSelector } from "react-redux";
import { getBankDetails } from "@/containers/Common/store/actions";
import { BankAccount } from "@/containers/MyAccount/components/Billing/BankAccount";
import { BankAccountState } from "@/containers/MyAccount/components/Billing/types";
import { Button, Dropdown, Loader, ModalFooter} from "@/shared/components";
import { CurrencyInput, Form, LinksArray, TextField, ImageArray } from "@/shared/components/Form/Formik";
import { MAX_LINK_TITLE_LENGTH, ScreenSize } from "@/shared/constants";
import DollarIcon from "@/shared/icons/dollar.icon";
import { BankAccountDetails, CommonLink, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { StageName } from "../../StageName";
import { FundsAllocationData, FundType } from "../types";
import { FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH } from "../constants";
import {FUND_TYPES} from '../constants';
import { getPrefix } from "../helpers";
import { fundAllocationValidationSchema } from "../validationSchema";
import { ProposalImage } from "@/shared/models/governance/proposals";
import "./index.scss";

interface FundAllocationFormProps {
  governance: Governance;
  initialData: FundsAllocationData;
  onFinish: (data: FundsAllocationData) => void;
  commonBalance: number;
}

interface FormValues {
  title: string;
  description: string;
  goalOfPayment: string;
  fund: FundType;
  amount: number;
  links: CommonLink[];
  images: ProposalImage[];
  commonBalance: number;
  bankAccountDetails: BankAccountDetails | null;
  areImagesLoading: boolean;
}

const FundAllocationForm: FC<FundAllocationFormProps> = (props) => {
    const dispatch = useDispatch();
  const { initialData, onFinish, commonBalance } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const formRef = useRef<FormikProps<FormValues>>(null);
  const [selectedFund, setSelectedFund] = useState<FundType>(FundType.ILS);
  const [bankAccountState, setBankAccountState] = useState<BankAccountState>({
    loading: false,
    fetched: false,
    bankAccount: null,
  });

  useEffect(() => {
    if (bankAccountState.loading || bankAccountState.fetched) {
      return;
    }

    setBankAccountState((state) => ({
      ...state,
      loading: true,
    }));
    dispatch(
      getBankDetails.request({
        callback: (error, bankAccount) => {
          setBankAccountState({
            loading: false,
            fetched: true,
            bankAccount: !error && bankAccount ? bankAccount : null,
          });
        },
      })
    );
  }, [dispatch, bankAccountState]);

  const handleBankAccountChange = (data: BankAccountDetails | null) => {
    setBankAccountState((nextState) => ({
      ...nextState,
      bankAccount: data,
    }));
  };

  const handleFundSelect = (selectedFund: unknown) => {
    setSelectedFund(selectedFund as FundType);
  };

  const getInitialValues = (): FormValues => ({
    title: formRef.current?.values.title || "",
    description:formRef.current?.values.description || "",
    goalOfPayment:formRef.current?.values.goalOfPayment || "",
    fund: FundType.ILS,
    amount: formRef.current?.values.amount || 0,
    links: formRef.current?.values.links || [],
    commonBalance: commonBalance / 100,
    bankAccountDetails: bankAccountState.bankAccount,
    images: formRef.current?.values.images || [],
    areImagesLoading: false,
  });

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      onFinish({
        ...initialData,
        ...values,
        fund: selectedFund,
      });
    },
    [onFinish, initialData]
  );

  const handleContinueClick = () => {
    formRef.current?.submitForm();
  };

  return (
    <div className="funds-allocation-form">
      <StageName
        className="funds-allocation-form__stage-name"
        name="Funds Allocation"
        backgroundColor="light-yellow"
        icon={
          <DollarIcon className="funds-allocation-form__avatar-icon" />
        }
      />
      <div className="funds-allocation-form__container">
        <Formik
          enableReinitialize
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={fundAllocationValidationSchema}
          validateOnMount
        >
            {({ values, errors, touched, isValid }) => (
            <Form>
              <TextField
                className="funds-allocation-form__text-field"
                id="title"
                name="title"
                label="Title"
                placeholder="Briefly describe your proposal"
                maxLength={FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH}
                isRequired
              />
              <TextField
                className="funds-allocation-form__text-field"
                id="description"
                name="description"
                label="Description"
                placeholder="What exactly do you plan to do and how? How does it align with the Common's agenda and goals"
                rows={isMobileView ? 4 : 3}
                isTextarea
                isRequired
              />
              <TextField
                className="funds-allocation-form__text-field"
                id="goalOfPayment"
                name="goalOfPayment"
                label="Goal of Payment"
                placeholder="What exactly do you plan to do with the funding?"
                rows={isMobileView ? 4 : 3}
                isTextarea
                isRequired
              />
           <Dropdown
                className="funds-allocation-form__dropdown"
                options={FUND_TYPES}
                value={selectedFund}
                onSelect={handleFundSelect}
                label="Type of Funds"
                placeholder="Select Type"
                shouldBeFixed={false}
              />
              <CurrencyInput
                className="funds-allocation-form__text-field"
                id="amount"
                name="amount"
                label="Amount"
                placeholder="10"
                prefix={getPrefix(selectedFund)}
              />
              {bankAccountState.loading ? (
                <div>
                  <Loader />
                </div>
              ) : (
                <div className="funds-allocation-form__bank-account-wrapper">
                  <BankAccount
                    bankAccount={bankAccountState.bankAccount}
                    onBankAccountChange={handleBankAccountChange}
                  />
                </div>
              )}
              <LinksArray
                name="links"
                values={values.links}
                errors={errors.links}
                touched={touched.links}
                maxTitleLength={MAX_LINK_TITLE_LENGTH}
                className="funds-allocation-form__text-field"
                itemClassName="funds_allocation__links-array-item"
              />
              <ImageArray
                name="images"
                values={values.images}
                areImagesLoading={values.areImagesLoading}
                loadingFieldName="areImagesLoading"
              />
              <ModalFooter sticky={!isMobileView}>
                <div className="funds-allocation-form__modal-footer">
                  <Button
                    onClick={handleContinueClick}
                    shouldUseFullWidth={isMobileView}
                    disabled={
                      !isValid ||
                      values.areImagesLoading ||
                      (!bankAccountState.bankAccount && values.amount > 0)
                    }
                  >
                    Create proposal
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FundAllocationForm;
