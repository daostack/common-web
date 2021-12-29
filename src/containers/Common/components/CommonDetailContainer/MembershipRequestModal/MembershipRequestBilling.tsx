import React, { useEffect, useState } from "react";
import BillingDetailsService from "../../../../../services/BillingDetailsService";
import { countryList } from "../../../../../shared/assets/countries";
import { Loader } from "../../../../../shared/components";
import { formatPrice } from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import { IStageProps } from "./MembershipRequestModal";
import "./index.scss";

export default function MembershipRequestBilling(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const [areBillingDetailsFetched, setAreBillingDetailsFetched] = useState(false);

  const isMonthlyContribution =
    common?.metadata.contributionType === CommonContributionType.Monthly;

  const countries = countryList.map((country) => (
    <option
      key={country.value}
      value={country.value}
    >{`${country.name}`}</option>
  ));

  useEffect(() => {
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
        }

        setAreBillingDetailsFetched(true);
      } catch (error) {
        console.error("Error during billing details fetch");
      }
    })();
  }, []);

  return (
    <div className="membership-request-content membership-request-billing">
      <div className="sub-title">Billing Details</div>
      <div className="sub-text">{`You are contributing ${formatPrice(
        userData.contributionAmount,
        false
      )} (${
        isMonthlyContribution ? "monthly" : "one-time"
      }) to this Common`}</div>
      {!areBillingDetailsFetched && (
        <div className="membership-request-billing__loader-wrapper">
          <Loader />
        </div>
      )}
      {areBillingDetailsFetched && (
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
                onChange={(e) => setUserData({ ...userData, city: e.target.value })}
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
            onClick={() => setUserData({ ...userData, stage: 5 })}
          >
            Continue to payment
          </button>
        </>
      )}
    </div>
  );
}
