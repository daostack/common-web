interface SagaCallback<D, E, R = void> {
  callback: (error: E | null, data?: D) => R;
}

type SagaOptionalCallback<D, E, R = void> = Partial<SagaCallback<D, E, R>>;

interface SagaCallbackWithPayload<P, D, E, R = void>
  extends SagaCallback<D, E, R> {
  payload: P;
}

interface SagaOptionalCallbackWithPayload<P, D, E, R = void>
  extends SagaOptionalCallback<D, E, R> {
  payload: P;
}

export type PayloadWithCallback<P, D, E, R = void> = [P] extends [void]
  ? SagaCallback<D, E, R>
  : SagaCallbackWithPayload<P, D, E, R>;

export type PayloadWithOptionalCallback<P, D, E, R = void> = [P] extends [void]
  ? SagaOptionalCallback<D, E, R>
  : SagaOptionalCallbackWithPayload<P, D, E, R>;
