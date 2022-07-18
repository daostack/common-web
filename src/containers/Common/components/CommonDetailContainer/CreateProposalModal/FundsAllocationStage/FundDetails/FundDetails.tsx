import React, { FC, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import {
  Dropdown,
  DropdownOption,
  Button,
  ModalFooter,
  Separator,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import DollarIcon from "@/shared/icons/dollar.icon";
import { Circle, CommonMemberWithUserInfo, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { generateCirclesBinaryNumber } from "../../../CommonWhitepaper/utils";
import { StageName } from "../../StageName";
import { MemberInfo } from "../MemberInfo";
import { FundsAllocationData, FundType, RecipientType } from "../types";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { Form, TextField, LinksArray, CurrencyInput } from "@/shared/components/Form/Formik";
import { AddingCard } from '../../../../../../MyAccount/components/Billing/AddingCard'
import { BankAccountInfo } from "../../../../../../MyAccount/components/Billing/BankAccountInfo";
import { BankAccountDetails } from "@/shared/models";
import { BankAccount } from "../../../../../../MyAccount/components/Billing/BankAccount";
import { BankAccountState } from '../../../../../../MyAccount/components/Billing/types'
import {
  getBankDetails,
  loadUserCards,
} from "@/containers/Common/store/actions";
import "./index.scss";

const fundTypes = ['ILS', 'Dollars', 'Tokens'];

interface ConfigurationProps {
  governance: Governance;
  initialData: FundsAllocationData | null;
  onFinish: (data: FundsAllocationData) => void;
}

interface FormValues {
  fund: FundType;
  amount: number;
}

const FundDetails: FC<ConfigurationProps> = (props) => {
  const dispatch = useDispatch();
  const { governance, initialData, onFinish } = props;
  const isInitialCircleUpdate = useRef(true);
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const formRef = useRef<FormikProps<FormValues>>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bankAccountState, setBankAccountState] = useState<BankAccountState>({
    loading: false,
    fetched: false,
    bankAccount: null,
  });
  const [selectedFund, setSelectedFund] = useState<FundType | null>('ILS');

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
    amount: 0 
  });

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      console.log('fund', selectedFund);
      onFinish({
        fund: selectedFund,
        amount: values.amount || 10
        //title: values.title,
        //description: values.description,
        //goalOfPayment: values.goalOfPayment
      });
    },
    [onFinish]
  );

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
      onFinish(formRef.current.values)
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

  const startEditing = () => {
    setIsEditing(true);
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
          onSubmit={handleSubmit}
          innerRef={formRef}
          //validationSchema={validationSchema}
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
