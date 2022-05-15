export interface LoadingState<D> {
  data: D;
  loading: boolean;
  fetched: boolean;
}
