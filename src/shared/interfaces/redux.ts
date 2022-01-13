interface SagaCallback<D, E, R = void> {
  callback: (error: E | null, data?: D) => R;
}

interface SagaCallbackWithPayload<P, D, E, R = void>
  extends SagaCallback<D, E, R> {
  payload: P;
}

export type PayloadWithCallback<P, D, E, R = void> = [P] extends [void]
  ? SagaCallback<D, E, R>
  : SagaCallbackWithPayload<P, D, E, R>;
