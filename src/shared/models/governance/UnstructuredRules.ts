export interface BaseRule {
  title: string;
  definition: string;
}

interface Rule extends BaseRule {
  readonly id: string;
}

export type UnstructuredRules = Rule[];
