import { Colors } from "../../../../../shared/constants";

export const verificationCodeStyle = {
  wrapperStyle: {
    margin: "1.5rem 0 3rem",
    display: "flex",
    minWidth: "17rem",
    justifyContent: "space-between",
  },
  inputStyle: {
    "-webkit-appearance": "none",
    "-moz-appearance": "none",
    Appearance: "none",
    width: "3.5rem",
    height: "4.5rem",
    margin: "0",
    display: "flex",
    FlexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    borderRadius: "0.75rem",
    boxShadow: `0 3px 8px 0 ${Colors.shadow2}`,
    border: `1px solid ${Colors.lightGray3}`,
    backgroundColor: Colors.white,
    fonFamily: "NunitoSans, sans-serif",
    fontSize: "2.25rem",
    TextAlign: "center",
    color: Colors.secondaryBlue,
  },
};
