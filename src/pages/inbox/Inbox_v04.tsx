import React, { FC } from "react";
import { RoutesV04Provider } from "@/shared/contexts";
import BaseInboxPage from "./BaseInbox";

const InboxPage_v04: FC = () => (
  <RoutesV04Provider>
    <BaseInboxPage />
  </RoutesV04Provider>
);

export default InboxPage_v04;
