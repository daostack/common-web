import React, { FC, ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useActiveItemDataChange } from "@/pages/commonFeed/hooks";
import { MainRoutesProvider } from "@/shared/contexts";
import { MultipleSpacesLayoutPageContent } from "@/shared/layouts";
import { multipleSpacesLayoutActions } from "@/store/states";
import BaseInboxPage from "./BaseInbox";

const InboxPage: FC = () => {
  const dispatch = useDispatch();
  const onActiveItemDataChange = useActiveItemDataChange();

  const renderContentWrapper = (children: ReactNode): ReactNode => (
    <MultipleSpacesLayoutPageContent headerContent={<div>Header</div>}>
      {children}
    </MultipleSpacesLayoutPageContent>
  );

  useEffect(() => {
    dispatch(multipleSpacesLayoutActions.moveBreadcrumbsToPrevious());
  }, []);

  return (
    <MainRoutesProvider>
      <BaseInboxPage
        renderContentWrapper={renderContentWrapper}
        onActiveItemDataChange={onActiveItemDataChange}
      />
    </MainRoutesProvider>
  );
};

export default InboxPage;
