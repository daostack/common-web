import React, { useCallback, useEffect, useState } from "react";
import BillingDetailsService from "../../../../../services/BillingDetailsService";
import { countryList } from "../../../../../shared/assets/countries";
import { Loader } from "../../../../../shared/components";
import { formatPrice } from "../../../../../shared/utils";
import {
  BillingDetails,
  CommonContributionType,
} from "../../../../../shared/models";
import { IStageProps } from "./MembershipRequestModal";
import "./index.scss";

export default function MembershipRequestBilling(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const [
    fetchedBillingDetails,
    setFetchedBillingDetails,
  ] = useState<BillingDetails | null>(null);
  const [areBillingDetailsFetched, setAreBillingDetailsFetched] = useState(
    false
  );
  const [
    areBillingDetailsSubmitting,
    setAreBillingDetailsSubmitting,
  ] = useState(false);
  const shouldShowLoader = !areBillingDetailsFetched || areBillingDetailsSubmitting;

  const isMonthlyContribution =
    common?.metadata.contributionType === CommonContributionType.Monthly;

  const countries = countryList.map((country) => (
    <option
      key={country.value}
      value={country.value}
    >{`${country.name}`}</option>
  ));

  const handleContinue = useCallback(async () => {
    const billingDetails: BillingDetails = {
      name: userData.fullname,
      city: userData.city,
      country: userData.country,
      line1: userData.address,
      postalCode: userData.postal,
    };

    if (!fetchedBillingDetails) {
      try {
        setAreBillingDetailsSubmitting(true);
        await BillingDetailsService.createBillingDetails(billingDetails);
        setUserData((nextUserData) => ({ ...nextUserData, stage: 5 }));
      } catch (error) {
        console.error("Error during billing details creation");
      }

      return;
    }

    if (
      billingDetails.name !== fetchedBillingDetails.name ||
      billingDetails.city !== fetchedBillingDetails.city ||
      billingDetails.country !== fetchedBillingDetails.country ||
      billingDetails.line1 !== fetchedBillingDetails.line1 ||
      billingDetails.postalCode !== fetchedBillingDetails.postalCode
    ) {
      try {
        setAreBillingDetailsSubmitting(true);
        await BillingDetailsService.updateBillingDetails(billingDetails);
      } catch (error) {
        console.error("Error during billing details update");
        return;
      }
    }

    setUserData((nextUserData) => ({ ...nextUserData, stage: 5 }));
  }, [userData, setUserData, fetchedBillingDetails]);

  useEffect(() => {
    if (areBillingDetailsFetched) {
      return;
    }

    (async () => {
      try {
        const billingDetails = await BillingDetailsService.getBillingDetails();

        if (billingDetails) {
          setUserData((nextUserData) => ({
            ...nextUserData,
            fullname: billingDetails.name,
            city: billingDetails.city,
            country: billingDetails.country,
            address: billingDetails.line1,
            postal: billingDetails.postalCode,
          }));
          setFetchedBillingDetails(billingDetails);
        }

        setAreBillingDetailsFetched(true);
      } catch (error) {
        console.error("Error during billing details fetch");
      }
    })();
  }, [areBillingDetailsFetched, setUserData]);

  return (
    <div className="membership-request-content membership-request-billing">
      <div className="sub-title">Billing Details</div>
      <div className="sub-text">{`You are contributing ${formatPrice(
        userData.contributionAmount,
        false
      )} (${
        isMonthlyContribution ? "monthly" : "one-time"
      }) to this Common`}</div>
      {shouldShowLoader && (
        <div className="membership-request-billing__loader-wrapper">
          <Loader />
        </div>
      )}
      {!shouldShowLoader && (
        <>
          <div className="inputs-wrapper">
            <div className="inputs-group">
              <label>Full Name</label>
              <input
                type="text"
                value={userData.fullname}
                onChange={(e) =>
                  setUserData({ ...userData, fullname: e.target.value })
                }
              />
              <label>Country</label>
              <select
                value={userData.country}
                onChange={(e) =>
                  setUserData({ ...userData, country: e.target.value })
                }
              >
                <option value="" disabled>
                  --- select country ---
                </option>
                {countries}
              </select>
              <label>Address</label>
              <input
                type="text"
                value={userData.address}
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
              />
            </div>
            <div className="inputs-group">
              <label>City</label>
              <input
                type="text"
                value={userData.city}
                onChange={(e) =>
                  setUserData({ ...userData, city: e.target.value })
                }
              />
              <label>District</label>
              <input
                type="text"
                value={userData.district}
                onChange={(e) =>
                  setUserData({ ...userData, district: e.target.value })
                }
              />
              <label>Postal Code</label>
              <input
                type="text"
                value={userData.postal}
                onChange={(e) =>
                  setUserData({ ...userData, postal: e.target.value })
                }
              />
            </div>
          </div>
          <button
            disabled={
              !userData.fullname ||
              !userData.city ||
              !userData.country ||
              !userData.district ||
              !userData.address ||
              !userData.postal
            }
            className="button-blue"
            onClick={handleContinue}
          >
            Continue to payment
          </button>
        </>
      )}
    </div>
  );
}
