import { ReactNode } from "react";

export interface CommonPageSettings {
  renderHeaderContent?: () => ReactNode;
  generatePagePath: (commonId: string) => string;
  withFeedTab?: boolean;
}

export interface CommonRouterParams {
  id: string;
}
