import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { useDispatch, useSelector } from "react-redux";
import { getBankDetails } from "@/containers/Common/store/actions";
import { BankAccount } from "@/containers/MyAccount/components/Billing/BankAccount";
import { BankAccountState } from "@/containers/MyAccount/components/Billing/types";
import { Button, Dropdown, Loader, ModalFooter } from "@/shared/components";
import { CurrencyInput, Form, LinksArray, TextField, ImageArray } from "@/shared/components/Form/Formik";
import { MAX_LINK_TITLE_LENGTH, ScreenSize, AllocateFundsTo } from "@/shared/constants";
import DollarIcon from "@/shared/icons/dollar.icon";
import { BankAccountDetails, CommonLink, Governance, Common, CommonMemberWithUserInfo } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { StageName } from "../../StageName";
import { FundsAllocationData, FundType } from "../types";
import { FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH } from "../constants";
import {FUND_TYPES} from '../constants';
import { getPrefix } from "../helpers";
import { fundAllocationValidationSchema } from "../validationSchema";
import { ProposalImage } from "@/shared/models/governance/proposals";
import { FundDetails } from "@/containers/Common/components/CommonDetailContainer/CreateProposalModal/FundsAllocationStage/FundDetails";
import "./index.scss";

interface FundAllocationFormProps {
  governance: Governance;
  initialData: FundsAllocationData;
  onFinish: (data: FundsAllocationData) => void;
  commonBalance: number;
  commonMembers: CommonMemberWithUserInfo[];
  commonList: Common[];
}

interface FormValues {
  title: string;
  description: string;
  goalOfPayment: string;
  links: CommonLink[];
  images: ProposalImage[];
  commonBalance: number;
  bankAccountDetails: BankAccountDetails | null;
  areImagesLoading: boolean;
  to: AllocateFundsTo;
  subcommonId: string | null;
  otherMemberId: string | null;
}

const FundAllocationForm: FC<FundAllocationFormProps> = (props) => {
  const dispatch = useDispatch();
  const { initialData, onFinish, commonBalance, commonMembers, commonList, governance } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const formRef = useRef<FormikProps<FormValues>>(null);
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

  const getInitialValues = (): FormValues => ({
    title: formRef.current?.values.title || "",
    description:formRef.current?.values.description || "",
    goalOfPayment:formRef.current?.values.goalOfPayment || "",
    links: formRef.current?.values.links || [],
    commonBalance: commonBalance / 100,
    bankAccountDetails: bankAccountState.bankAccount,
    images: formRef.current?.values.images || [],
    areImagesLoading: false,
    to: AllocateFundsTo.Proposer,
    subcommonId: null,
    otherMemberId: null,
  });

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      onFinish({
        ...initialData,
        ...values,
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
        name="Fund allocation"
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
              <FundDetails
                  governance={governance}
                  initialData={initialData}
                  onFinish={onFinish}
                  commonBalance={commonBalance}
                  commonMembers={commonMembers}
                  commonList={commonList}
                />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FundAllocationForm;
