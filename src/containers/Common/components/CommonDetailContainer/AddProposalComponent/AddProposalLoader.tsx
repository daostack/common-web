import React from "react";
import { Loader } from "@/shared/components";

const AddProposalLoader = () => {
  return (
    <div className="add-proposal-loader-wrapper">
      <img
        src="/icons/add-proposal/illustrations-full-page-creating-a-common.svg"
        alt="confirm"
      />
      <div className="loader-title">Creating your proposal</div>
      <div className="loader">
        <Loader />
      </div>
    </div>
  );
};

export default AddProposalLoader;
