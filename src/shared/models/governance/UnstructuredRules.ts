export interface BaseRule {
  title: string;
  definition: string;
}

export interface Rule extends BaseRule {
  readonly id: string;
}

export type UnstructuredRules = Rule[];
