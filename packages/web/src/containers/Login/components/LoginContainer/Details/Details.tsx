import React from "react";
import "./index.scss";
import "../../../containers/LoginContainer/index.scss";

const Details = () => {
  return (
    <div className="details-wrapper">
      <span className="title">Complete your account</span>
      <span className="sub-text">Help the community to get to know you better</span>
      <form>
        <label>
          <span>First name</span>
          <span>Required</span>
        </label>
        <input type="text" />
        <label>
          <span>Last name</span>
          <span>Required</span>
        </label>
        <input type="text" />
        <label>Country</label>
        <select></select>
      </form>
      <button className="button-blue">Continue</button>
    </div>
  );
};

export default Details;
