import React, { useState } from "react";
import classNames from "classnames";
import WhitepaperMembers from "./components/WhitepaperMembers/WhitepaperMembers";
import WhitepaperProposals from "./components/WhitepaperProposals/WhitepaperProposals";
import "./index.scss";

enum Tabs {
  Members,
  Proposals,
}

export default function CommonWhitepaper() {
  const [toggle, setToggle] = useState(false);
  const [tab, setTab] = useState(Tabs.Members);

  return (
    <div className="common-whitepaper-wrapper">
      <div className="common-whitepaper__title">White Paper</div>
      <span>Common’s set of guides are managed by user type.</span>
      {toggle && (
        <div className="common-whitepaper__content">
          <div className="common-whitepaper__tabs">
            <div onClick={() => setTab(Tabs.Members)} className={classNames("common-whitepaper__tab", { "common-whitepaper__tab--active": tab === Tabs.Members })}>Members</div>
            <div onClick={() => setTab(Tabs.Proposals)} className={classNames("common-whitepaper__tab", { "common-whitepaper__tab--active": tab === Tabs.Proposals })}>Proposals</div>
          </div>
          {tab === Tabs.Members ? <WhitepaperMembers /> : <WhitepaperProposals />}
        </div>
      )}
      <div className="common-whitepaper__see-more" onClick={() => setToggle(!toggle)}>See {toggle ? "less <" : "more >"}</div>
    </div>
  )
}
