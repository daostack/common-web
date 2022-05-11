import { DropdownOption } from "../components";

export enum Gender {
  Male,
  Female,
}

export const GENDER_OPTIONS: DropdownOption[] = [
  {
    text: "Male",
    value: Gender.Male,
  },
  {
    text: "Female",
    value: Gender.Female,
  },
];
