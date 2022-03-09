import { CSSProperties } from "react";
import { Colors } from "../../../../../shared/constants";

const INPUT_STYLE: CSSProperties = {
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
  width: "3.5rem",
  height: "4.5rem",
  margin: "0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "stretch",
  borderRadius: "0.75rem",
  boxShadow: `0 3px 8px 0 ${Colors.shadow2}`,
  border: `1px solid ${Colors.lightGray3}`,
  backgroundColor: Colors.white,
  fontFamily: "NunitoSans, sans-serif",
  fontSize: "2.25rem",
  textAlign: "center",
  color: Colors.secondaryBlue,
};

export const verificationCodeStyle: Record<string, CSSProperties> = {
  wrapperStyle: {
    maxWidth: "25rem",
    width: "100%",
    margin: "1.5rem 0 0",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  inputStyle: INPUT_STYLE,
  mobileInputStyle: {
    ...INPUT_STYLE,
    width: "3rem",
    height: "4rem",
  },
};
