import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { getBankDetails } from "@/containers/Common/store/actions";
import { BankAccount } from "@/containers/MyAccount/components/Billing/BankAccount";
import { BankAccountState } from "@/containers/MyAccount/components/Billing/types";
import { Button, Dropdown, Loader, ModalFooter } from "@/shared/components";
import {
  CurrencyInput,
  Form,
  LinksArray,
  ImageArray,
} from "@/shared/components/Form/Formik";
import { ScreenSize, MAX_LINK_TITLE_LENGTH } from "@/shared/constants";
import DollarIcon from "@/shared/icons/dollar.icon";
import { BankAccountDetails, Governance, CommonLink } from "@/shared/models";
import { ProposalImage } from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { StageName } from "../../StageName";
import { getPrefix } from "../helpers";
import { FundsAllocationData, FundType } from "../types";
import { fundDetailsValidationSchema } from "../validationSchema";
import { FUND_TYPES } from "../constants";
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  initialData: FundsAllocationData;
  onFinish: (data: FundsAllocationData) => void;
  commonBalance: number;
}

interface FormValues {
  fund: FundType;
  amount: number;
  links: CommonLink[];
  commonBalance: number;
  bankAccountDetails: BankAccountDetails | null;
  images: ProposalImage[];
  areImagesLoading: boolean;
}

const FundDetails: FC<ConfigurationProps> = (props) => {
  const dispatch = useDispatch();
  const { commonBalance, initialData, onFinish } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const formRef = useRef<FormikProps<FormValues>>(null);
  const [bankAccountState, setBankAccountState] = useState<BankAccountState>({
    loading: false,
    fetched: false,
    bankAccount: null,
  });
  const [selectedFund, setSelectedFund] = useState<FundType>(FundType.ILS);

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

  const getInitialValues = (): FormValues => ({
    fund: FundType.ILS,
    amount: 0,
    links: [],
    commonBalance: commonBalance / 100,
    bankAccountDetails: bankAccountState.bankAccount,
    images: [],
    areImagesLoading: false,
  });

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      onFinish({
        ...initialData,
        fund: selectedFund,
        amount: values.amount,
        links: values.links,
        images: values.images,
      });
    },
    [onFinish]
  );

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
      onFinish({
        ...initialData,
        ...formRef.current.values,
      });
    }
  }, []);

  const handleBankAccountChange = (data: BankAccountDetails | null) => {
    setBankAccountState((nextState) => ({
      ...nextState,
      bankAccount: data,
    }));
  };

  const handleFundSelect = (selectedFund: unknown) => {
    if (selectedFund === FundType.ILS) {
      setSelectedFund(selectedFund);
    }
  };

  return (
    <div className="funds-allocation-configuration">
      <StageName
        className="funds-allocation-configuration__stage-name"
        name="Funds Allocation"
        backgroundColor="light-yellow"
        icon={
          <DollarIcon className="funds-allocation-configuration__avatar-icon" />
        }
      />
      <div className="funds-allocation-configuration__form">
        <Formik
          initialValues={getInitialValues()}
          enableReinitialize
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={fundDetailsValidationSchema}
          validateOnMount
        >
          {({ values, errors, touched, isValid }) => (
            <Form>
              <Dropdown
                className="funds-allocation-details__type-dropdown"
                options={FUND_TYPES}
                value={selectedFund}
                onSelect={handleFundSelect}
                label="Type of Funds"
                placeholder="Select Type"
                shouldBeFixed={false}
              />
              <CurrencyInput
                className="create-funds-allocation__text-field"
                id="amount"
                name="amount"
                label="Amount"
                placeholder="10"
                prefix={getPrefix(selectedFund)}
              />
              {values.amount > 0 && 
                <>
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
                </>
              }
              <LinksArray
                name="links"
                values={values.links}
                errors={errors.links}
                touched={touched.links}
                maxTitleLength={MAX_LINK_TITLE_LENGTH}
                className="create-funds-allocation__text-field"
                itemClassName="funds_allocation__links-array-item"
              />
              <ImageArray
                name="images"
                values={values.images}
                areImagesLoading={values.areImagesLoading}
                loadingFieldName="areImagesLoading"
              />
              <ModalFooter sticky={!isMobileView}>
                <div className="funds-allocation-configuration__modal-footer">
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

export default FundDetails;
