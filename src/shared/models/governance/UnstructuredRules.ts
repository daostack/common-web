export interface BaseRule {
  title: string;
  definition: string;
}

interface Rule extends BaseRule {
  readonly id: string;
}

export interface UnstructuredRules {
  [key: string]: Rule;
}
