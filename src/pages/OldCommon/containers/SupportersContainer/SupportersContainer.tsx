import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";
import { setLoginModalState } from "@/pages/Auth/store/actions";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { LanguageDropdown, Loader } from "@/shared/components";
import { ContributionType, ScreenSize } from "@/shared/constants";
import { useHeader, useLanguage, useQueryParams } from "@/shared/hooks";
import { useCommon, useSupportersData } from "@/shared/hooks/useCases";
import {
  getScreenSize,
  selectIsRtlLanguage,
  selectLanguage,
} from "@/shared/store/selectors";
import { Portal } from "@/shared/ui-kit";
import { getCommonPagePath } from "@/shared/utils";
import {
  DeadSeaUserDetailsFormValuesWithoutUserDetails,
  InitialStep,
  MemberAdmittanceStep,
  PaymentStep,
  Success,
  UserDetailsStep,
  Welcome,
} from "../../components/SupportersContainer";
import { SupportersStep } from "./constants";
import { SupportersDataContext, SupportersDataContextValue } from "./context";
import { getAmount, getContributionType, getInitialLanguage } from "./helpers";
import "./index.scss";

interface SupportersContainerRouterParams {
  id: string;
}

const SupportersContainer = () => {
  const { id: commonId } = useParams<SupportersContainerRouterParams>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { updateHeaderState } = useHeader();
  const { data: common, fetched: isCommonFetched, fetchCommon } = useCommon();
  const {
    data: supportersData,
    fetched: isSupportersDataFetched,
    fetchSupportersData,
  } = useSupportersData();
  const { changeLanguage } = useLanguage();
  const queryParams = useQueryParams();
  const [amount, setAmount] = useState(() => getAmount(queryParams));
  const [contributionType, setContributionType] = useState(() =>
    getContributionType(queryParams),
  );
  const {
    data: commonMember,
    fetched: isCommonMemberFetched,
    fetchCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
  });
  const initialLanguage = getInitialLanguage(queryParams);
  const [step, setStep] = useState(
    amount ? SupportersStep.UserDetails : SupportersStep.InitialStep,
  );
  const [formData, setFormData] =
    useState<DeadSeaUserDetailsFormValuesWithoutUserDetails>({
      supportPlan: "",
    });
  const user = useSelector(selectUser());
  const language = useSelector(selectLanguage());
  const isRtlLanguage = useSelector(selectIsRtlLanguage());
  const screenSize = useSelector(getScreenSize());
  const userId = user?.uid;
  const isMobileView = screenSize === ScreenSize.Mobile;
  const currentTranslation =
    (supportersData && supportersData.translations[language]) || null;
  const isMainDataFetched = isCommonFetched && isSupportersDataFetched;
  const isInitialLoading =
    (!user || !isCommonMemberFetched) && step === SupportersStep.UserDetails;
  const shouldShowLanguageDropdown =
    Object.keys(supportersData?.translations || {}).length > 1;
  const isOldCommonMember = Boolean(commonMember);

  const handleInitialStepFinish = (
    amount: number,
    contributionType: ContributionType,
  ) => {
    setAmount(amount);
    setContributionType(contributionType);
    setStep(SupportersStep.UserDetails);
  };

  const handleChangeAmount = (
    amount: number,
    contributionType: ContributionType,
  ) => {
    setAmount(amount);
    setContributionType(contributionType);
  };

  const handleUserDetailsStepFinish = (
    data: DeadSeaUserDetailsFormValuesWithoutUserDetails,
  ) => {
    setStep(SupportersStep.MemberAdmittance);
    setFormData(data);
  };

  const handleMemberAdmittanceStepFinish = () => {
    setStep(SupportersStep.Payment);
  };

  const handlePaymentStepFinish = () => {
    setStep(SupportersStep.Success);
  };

  const handleSuccessStepFinish = () => {
    if (commonMember?.rulesAccepted) {
      history.push(getCommonPagePath(commonId));
    } else {
      setStep(SupportersStep.Welcome);
    }
  };

  useEffect(() => {
    fetchCommon(commonId);
    fetchSupportersData(commonId);
    updateHeaderState({
      shouldHideHeader: true,
    });
  }, [commonId]);

  useEffect(() => {
    fetchCommonMember(commonId, {}, true);
  }, [commonId, userId]);

  useEffect(() => {
    if (isSupportersDataFetched && supportersData) {
      const languageToUse =
        initialLanguage && supportersData.translations[initialLanguage]
          ? initialLanguage
          : supportersData.defaultLocale;
      changeLanguage(languageToUse);
    }
  }, [isSupportersDataFetched]);

  useEffect(() => {
    if (
      !user &&
      currentTranslation &&
      amount &&
      step === SupportersStep.UserDetails
    ) {
      dispatch(
        setLoginModalState({
          isShowing: true,
          title: currentTranslation.title,
          canCloseModal: false,
          shouldShowUserDetailsAfterSignUp: false,
        }),
      );
    }
  }, [dispatch, user, currentTranslation, amount, step]);

  useEffect(() => {
    if (!user) {
      setStep(amount ? SupportersStep.UserDetails : SupportersStep.InitialStep);
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    if (
      isCommonMemberFetched &&
      commonMember &&
      step === SupportersStep.UserDetails
    ) {
      setStep(SupportersStep.Payment);
    }
  }, [isCommonMemberFetched, step]);

  const renderContent = () => {
    if (isInitialLoading) {
      return <Loader />;
    }

    switch (step) {
      case SupportersStep.InitialStep:
        return (
          <InitialStep amount={amount} onFinish={handleInitialStepFinish} />
        );
      case SupportersStep.UserDetails:
        return user ? (
          <UserDetailsStep
            user={user}
            formData={formData}
            onFinish={handleUserDetailsStepFinish}
          />
        ) : null;
      case SupportersStep.MemberAdmittance:
        return (
          <MemberAdmittanceStep
            data={formData}
            commonMember={commonMember}
            isCommonMemberFetched={isCommonMemberFetched}
            onFinish={handleMemberAdmittanceStepFinish}
          />
        );
      case SupportersStep.Payment:
        return (
          <PaymentStep
            contributionType={contributionType}
            amount={amount}
            onAmountChange={handleChangeAmount}
            onFinish={handlePaymentStepFinish}
          />
        );
      case SupportersStep.Success:
        return common ? (
          <Success
            common={common}
            isOldCommonMember={isOldCommonMember}
            onFinish={handleSuccessStepFinish}
          />
        ) : null;
      case SupportersStep.Welcome:
        return common?.governanceId ? (
          <Welcome
            commonId={common.id}
            commonName={common.name}
            governanceId={common.governanceId}
          />
        ) : null;
      default:
        return null;
    }
  };

  const contextValue = useMemo<SupportersDataContextValue>(
    () => ({
      supportersData,
      currentTranslation,
    }),
    [supportersData, currentTranslation],
  );

  if (!isMainDataFetched) {
    return <Loader />;
  }

  return (
    <div>
      <div
        className={classNames("supporters-page", {
          "supporters-page--rtl": isRtlLanguage,
        })}
      >
        {!common && <p>Couldn’t find common with id = "{commonId}"</p>}
        {common && !supportersData && (
          <p>Supporters flow is not supported by common "{common.name}".</p>
        )}
        {common && supportersData && currentTranslation && (
          <div className="supporters-page__content">
            {(!isMobileView || step !== SupportersStep.Welcome) && (
              <div className="supporters-page__main-image-wrapper">
                <img
                  className="supporters-page__main-image"
                  src={supportersData.photoURL}
                  alt={currentTranslation.title}
                />
              </div>
            )}
            <SupportersDataContext.Provider value={contextValue}>
              {renderContent()}
            </SupportersDataContext.Provider>
            {shouldShowLanguageDropdown && (
              <Portal>
                <div className="supporters-page__language-dropdown-portal-content">
                  <div className="supporters-page__language-dropdown-wrapper">
                    <LanguageDropdown className="supporters-page__language-dropdown" />
                  </div>
                </div>
              </Portal>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportersContainer;
