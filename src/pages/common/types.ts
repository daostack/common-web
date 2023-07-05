import { ReactNode } from "react";

export interface CommonPageSettings {
  pageContentClassName?: string;
  renderHeaderContent?: () => ReactNode;
  withFeedTab?: boolean;
}
