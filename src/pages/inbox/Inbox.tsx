import React, { FC, ReactNode } from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import { MultipleSpacesLayoutPageContent } from "@/shared/layouts";
import BaseInboxPage from "./BaseInbox";

const InboxPage: FC = () => {
  const renderContentWrapper = (children: ReactNode): ReactNode => (
    <MultipleSpacesLayoutPageContent headerContent={<div>Header</div>}>
      {children}
    </MultipleSpacesLayoutPageContent>
  );

  return (
    <MainRoutesProvider>
      <BaseInboxPage renderContentWrapper={renderContentWrapper} />
    </MainRoutesProvider>
  );
};

export default InboxPage;
