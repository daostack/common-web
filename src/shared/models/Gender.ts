import { DropdownOption } from "../components";

export enum Gender {
  Male = 0,
  Female = 1,
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
