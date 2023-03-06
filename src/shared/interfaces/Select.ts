export type SelectOptionType = {
  value: string;
  label: string;
}

export type SelectType<T> = T & SelectOptionType;