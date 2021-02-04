import { Option } from "./Option";

export interface Field {
  name: string;
  renderType: string;
  type?: string;
  label?: string;
  labelHtmlElement?: React.ReactNode;
  placeholder?: string;
  options?: Option[];
  fields?: Field[];
  wrapperClass?: string;
  inputClass?: string;
  disabled?: boolean;
  isShowPasswordIcon?: boolean;
}
