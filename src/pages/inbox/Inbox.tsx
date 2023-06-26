import React, { FC } from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import BaseInboxPage from "./BaseInbox";

const InboxPage: FC = () => (
  <MainRoutesProvider>
    <BaseInboxPage />
  </MainRoutesProvider>
);

export default InboxPage;
