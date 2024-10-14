import React from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import "./PrivacyPolicy.scss";

export function PrivacyPolicy() {
  return (
    <div className="container-pdf">
      <Document className="preview-pdf" file="/privacy_policy.pdf">
        <Page pageNumber={1} />
        <Page pageNumber={2} />
        <Page pageNumber={3} />
        <Page pageNumber={4} />
        <Page pageNumber={5} />
      </Document>
    </div>
  );
}
