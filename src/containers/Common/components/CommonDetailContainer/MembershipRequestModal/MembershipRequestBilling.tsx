import React from "react";
import { countryList } from "../../../../../shared/assets/countries";
import { formatPrice } from "../../../../../shared/utils";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestBilling(props: IStageProps) {
  const { userData, setUserData } = props;

  const countries = countryList.map((country) => (
    <option key={country.value} value={country.value}>{`${country.name}`}</option>
  ));

  return (
    <div className="membership-request-content membership-request-billing">
      <div className="sub-title">Billing Details</div>
      <div className="sub-text">{`You are contributing ${formatPrice(
        userData.contribution_amount,
        false,
      )} (monthly or one-time) to this Common`}</div>
      <div className="inputs-wrapper">
        <div className="inputs-group">
          <label>Fullname</label>
          <input
            type="text"
            value={userData.fullname}
            onChange={(e) => setUserData({ ...userData, fullname: e.target.value })}
          />
          <label>Country</label>
          <select value={userData.country} onChange={(e) => setUserData({ ...userData, country: e.target.value })}>
            <option value="" disabled>
              --- select country ---
            </option>
            {countries}
          </select>
          <label>Adderss</label>
          <input
            type="text"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
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
            onChange={(e) => setUserData({ ...userData, district: e.target.value })}
          />
          <label>Postal Code</label>
          <input
            type="text"
            value={userData.postal}
            onChange={(e) => setUserData({ ...userData, postal: e.target.value })}
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
    </div>
  );
}
