import {
  getBankDetails
} from "@/containers/Common/store/actions";
import {
  Button, Dropdown,
  DropdownOption, ModalFooter,
  Separator
} from "@/shared/components";
import { ScreenSize, MAX_LINK_TITLE_LENGTH } from "@/shared/constants";
import { CurrencyInput, Form } from "@/shared/components/Form/Formik";
import DollarIcon from "@/shared/icons/dollar.icon";
import { BankAccountDetails, Governance, CommonLink } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { TextField, LinksArray } from "@/shared/components/Form/Formik";
import { AddingCard } from '../../../../../../MyAccount/components/Billing/AddingCard'
import { BankAccountInfo } from "../../../../../../MyAccount/components/Billing/BankAccountInfo";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BankAccount } from "../../../../../../MyAccount/components/Billing/BankAccount";
import { BankAccountState } from '../../../../../../MyAccount/components/Billing/types';
import { StageName } from "../../StageName";
import { FundsAllocationData, FundType } from "../types";
import "./index.scss";
import { validationSchema } from './validationSchema';

const fundTypes = ['ILS', 'Dollars', 'Tokens'];

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
  const [selectedFund, setSelectedFund] = useState<FundType>('ILS');

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
    fund: 'ILS',
    amount: 0,
    links: [],
    commonBalance: commonBalance / 100,
    bankAccountDetails: bankAccountState.bankAccount
  });

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      onFinish({
        ...initialData,
        fund: selectedFund,
        amount: values.amount || 10,
        links: values.links,
      });
    },
    [onFinish]
  );

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
      onFinish({
        ...initialData,
        ...formRef.current.values
      })
    }
  }, []);

  const fundsOptions = useMemo<DropdownOption[]>(
    () =>
      fundTypes.map((fund) => ({
        text: fund,
        searchText: fund,
        value: fund,
      })),
    []
  );

  const handleBankAccountChange = (data: BankAccountDetails | null) => {
    setBankAccountState((nextState) => ({
      ...nextState,
      bankAccount: data,
    }));
  };

  const handleFundSelect = (selectedFund: unknown) => {
    setSelectedFund(selectedFund as FundType);
  };

  const getPrefix = () => {
    switch (selectedFund) {
      case "ILS":
        return '₪';
      case "Dollars":
        return '$';
      default:
        // TODO icon for tokens
        return '&';
    }
  }

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
      <Separator className="funds-allocation-configuration__separator" />
      <div className="funds-allocation-configuration__form">
        <Formik
          initialValues={getInitialValues()}
          enableReinitialize
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
          validateOnMount
        >
          {({ values, errors, touched, isValid }) => (
            <Form>
              <Dropdown
                className="assign-circle-configuration__circle-dropdown"
                options={fundsOptions}
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
                prefix={getPrefix()}        
              />
              <BankAccount
                bankAccount={bankAccountState.bankAccount}
                onBankAccountChange={handleBankAccountChange}
              />         
              <LinksArray
                name="links"
                values={values.links}
                errors={errors.links}
                touched={touched.links}
                maxTitleLength={MAX_LINK_TITLE_LENGTH}
                className="create-funds-allocation__text-field"
                itemClassName="funds_allocation__links-array-item"
              />
              <ModalFooter sticky={!isMobileView}>
                <div className="funds-allocation-configuration__modal-footer">
                  <Button
                    onClick={handleContinueClick}
                    shouldUseFullWidth={isMobileView}
                    disabled={!isValid}
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
