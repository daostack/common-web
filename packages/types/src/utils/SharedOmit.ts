export type SharedOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;