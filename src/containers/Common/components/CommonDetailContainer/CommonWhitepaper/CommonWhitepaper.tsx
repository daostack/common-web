import React, { useState } from "react";
import classNames from "classnames";
import { Common } from "@/shared/models";
import WhitepaperMembers from "./components/WhitepaperMembers/WhitepaperMembers";
import WhitepaperProposals from "./components/WhitepaperProposals/WhitepaperProposals";
import "./index.scss";

enum Tabs {
  Members,
  Proposals,
}

interface CommonWhitepaperProps {
  common: Common;
}

export default function CommonWhitepaper(props: CommonWhitepaperProps) {
  const { common } = props;
  const [toggle, setToggle] = useState(false);
  const [tab, setTab] = useState(Tabs.Members);

  return (
    <div className="common-whitepaper-wrapper">
      <div className="common-whitepaper__title">Governance</div>
      <span>
        The various permissions for each circle in {common.name}, in terms of
        proposing and voting on various actions.
      </span>
      {toggle && (
        <div className="common-whitepaper__content">
          <div className="common-whitepaper__tabs">
            <div
              onClick={() => setTab(Tabs.Members)}
              className={classNames("common-whitepaper__tab", {
                "common-whitepaper__tab--active": tab === Tabs.Members,
              })}
            >
              Circles
            </div>
            <div
              onClick={() => setTab(Tabs.Proposals)}
              className={classNames("common-whitepaper__tab", {
                "common-whitepaper__tab--active": tab === Tabs.Proposals,
              })}
            >
              Proposals
            </div>
          </div>
          {tab === Tabs.Members ? (
            <WhitepaperMembers />
          ) : (
            <WhitepaperProposals />
          )}
        </div>
      )}
      <div
        className="common-whitepaper__see-more"
        onClick={() => setToggle(!toggle)}
      >
        See {toggle ? "less <" : "more >"}
      </div>
    </div>
  );
}
