import React, { FC, useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
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
import { RadioButtonGroup, RadioButton } from "@/shared/components/Form";
import { ScreenSize, MAX_LINK_TITLE_LENGTH, RecipientType, Orientation, AllocateFundsTo } from "@/shared/constants";
import DollarIcon from "@/shared/icons/dollar.icon";
import { BankAccountDetails, Governance, CommonLink, Common, CommonMemberWithUserInfo } from "@/shared/models";
import { ProposalImage } from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { parseLinksForSubmission } from "@/shared/utils";
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
  commonMembers: CommonMemberWithUserInfo[];
  commonList: Common[];
}

interface FormValues {
  fund: FundType;
  amount: number;
  links: CommonLink[];
  commonBalance: number;
  bankAccountDetails: BankAccountDetails | null;
  images: ProposalImage[];
  areImagesLoading: boolean;
  to: AllocateFundsTo;
  subcommonId: string | null;
  otherMemberId: string | null;
}

const FundDetails: FC<ConfigurationProps> = (props) => {
  const dispatch = useDispatch();
  const { commonBalance, initialData, onFinish, commonMembers, commonList } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const formRef = useRef<FormikProps<FormValues>>(null);
  const [selectedRecipientType, setSelectedRecipientType] = useState(RecipientType.Member)
  const [bankAccountState, setBankAccountState] = useState<BankAccountState>({
    loading: false,
    fetched: false,
    bankAccount: null,
  });
  const [selectedFund, setSelectedFund] = useState<FundType>(FundType.ILS);

  const memberOptions = useMemo(
    () => commonMembers.map(({user, id}) => ({
      text: user.displayName || `${user.firstName} ${user.lastName}`,
      searchText: user.displayName || `${user.firstName} ${user.lastName}`,
      value: id,
    })),
    [commonMembers]
  );

  const commonsOptions = useMemo(
    () => commonList.map(({id, name}) => ({
        text: name,
        searchText: name,
        value: id,
      })),
    [commonList]
  );

  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [recipientDropdownDetails, setRecipientDropdownDetails] = useState(memberOptions)

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
    to: AllocateFundsTo.Proposer,
    subcommonId: null,
    otherMemberId: null,
  });

  const getTo = () => selectedRecipientType === RecipientType.Member
    ? AllocateFundsTo.Proposer
    : AllocateFundsTo.SubCommon;

  const getRecipientDetails = () => {
    const to = getTo();
    if (to === AllocateFundsTo.Proposer) {
      const member = memberOptions.find((member) => member.value === selectedRecipient);
      return {
        to,
        otherMemberId: selectedRecipient,
        recipientName: member?.text,
      }
    }
    const subcommon = commonsOptions.find((common) => common.value === selectedRecipient);
    return {
      to,
      subcommonId: selectedRecipient,
      recipientName: subcommon?.text,
    }
  }

  const handleSubmit = (values: FormValues) => {
      const links = parseLinksForSubmission(values.links);

      onFinish({
        ...initialData,
        fund: selectedFund,
        amount: values.amount,
        links,
        images: values.images,
        ...getRecipientDetails(),
      });
    }

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
      onFinish({
        ...initialData,
        ...formRef.current.values,
        ...getRecipientDetails(),
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

  const handleSelectRecipentType = (value: unknown) => {
      setSelectedRecipientType(value as RecipientType);
      value === RecipientType.Common
        ? setRecipientDropdownDetails(commonsOptions)
        : setRecipientDropdownDetails(memberOptions)
  }

  const handleSetSelectedRecipient = (value) => {
      setSelectedRecipient(value)
  }

  const toggleButtonStyles = useMemo(() => (
    {
      default: "contribution-amount-selection__toggle-button"
    }
  ), [])

  return (
    <div className="funds-allocation-configuration">
      {!isMobileView && (
        <StageName
          className="funds-allocation-configuration__stage-name"
          name="Fund allocation"
          backgroundColor="light-yellow"
          icon={
            <DollarIcon className="funds-allocation-configuration__avatar-icon" />
          }
        />
      )}
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
              <div className="funds-input-row">
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
                  className="create-funds-allocation__currency"
                  id="amount"
                  name="amount"
                  label="Amount"
                  placeholder="10"
                  prefix={getPrefix(selectedFund)}
                />
              </div>
              {values.amount > 0 && (
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
              )}
              <RadioButtonGroup
                className="recipient-selection__toggle-button-group"
                label="Recipient"
                value={selectedRecipientType}
                onChange={handleSelectRecipentType}
                variant={Orientation.Horizontal}
              >
                <RadioButton
                  value={RecipientType.Member}
                  styles={toggleButtonStyles}
                  checked={selectedRecipientType === RecipientType.Member}
                ></RadioButton>
                {commonsOptions.length > 0 && (
                  <RadioButton
                    value={RecipientType.Common}
                    styles={toggleButtonStyles}
                    checked={selectedRecipientType === RecipientType.Common}
                  ></RadioButton>
                )}
              </RadioButtonGroup>

              <Dropdown
                className="funds-allocation-details__type-dropdown"
                options={recipientDropdownDetails}
                value={selectedRecipient}
                onSelect={handleSetSelectedRecipient}
                placeholder={`Choose ${selectedRecipientType}`}
                shouldBeFixed={false}
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
