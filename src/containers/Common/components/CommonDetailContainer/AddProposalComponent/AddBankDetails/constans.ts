import { DropdownOption } from "@/shared/components";

export enum Gender {
  None,
  Man,
  Woman,
}

export const BANKS_OPTIONS = [
  {
    value: 12,
    name: 'Bank Hapoalim',
  },
  {
    value: 10,
    name: 'Bank Leumi',
  },
  {
    value: 20,
    name: 'Bank Mizrahi-Tefahot',
  },
  {
    value: 11,
    name: 'Israel Discount Bank',
  },
];

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
