import { DropdownOption } from "../components";

export enum Gender {
  None,
  Man,
  Woman,
}

export const GENDER_OPTIONS: DropdownOption[] = [
  {
    text: "Man",
    value: Gender.Man,
  },
  {
    text: "Woman",
    value: Gender.Woman
  }
]
