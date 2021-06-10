export * from './apolloHelper';

export interface IPaginate {
  take: number;
  skip: number;
}

export const DefaultPaginate: IPaginate = {
  skip: 0,
  take: 10
};