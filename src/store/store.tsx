import { routerMiddleware } from "connected-react-router";
import { History } from "history";
import {
  createStore,
  applyMiddleware,
  compose,
  Middleware,
  Dispatch,
  Store,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import freeze from "redux-freeze";
import createSagaMiddleware from "redux-saga";
import { AppState } from "@/shared/interfaces";
import rootReducer from "./reducer";
import appSagas from "./saga";

const sagaMiddleware = createSagaMiddleware();
let middleware: Array<Middleware>;
// eslint-disable-next-line @typescript-eslint/ban-types
let composer: Function;

if (process.env.REACT_APP_ENV === "dev") {
  middleware = [freeze, sagaMiddleware];
  composer = composeWithDevTools({ trace: true, traceLimit: 25 });
} else {
  middleware = [sagaMiddleware];
  composer =
    process.env.REACT_APP_ENV === "production"
      ? compose
      : composeWithDevTools({ trace: true, traceLimit: 25 });
}

const errorHandlerMiddleware: Middleware =
  () => (next: Dispatch) => (action) => {
    if (action.type.includes("FAILURE")) {
      // next(
      //   showNotification({
      //     message: action.payload.error || action.payload.message,
      //     appearance: "error",
      //   }),
      // );

      if (
        action.payload &&
        (action.payload.code === 401 || action.payload.code === 403)
      ) {
        localStorage.clear();
      }
    }

    if (
      action.type.includes("SUCCESS") &&
      action.payload &&
      action.payload.message
    ) {
      // next(
      //   showNotification({
      //     message: action.payload.message,
      //     appearance: "success",
      //   }),
      // );
    }

    return next(action);
  };

export default function configureStore(history: History) {
  const store: Store<AppState> = createStore(
    rootReducer(history),
    undefined,
    composer(
      applyMiddleware(
        ...middleware,
        routerMiddleware(history),
        errorHandlerMiddleware,
      ),
    ),
  );

  sagaMiddleware.run(appSagas);

  // eslint-disable-next-line
  if ((module as any).hot) {
    // eslint-disable-next-line
    (module as any).hot.accept(() =>
      store.replaceReducer(rootReducer(history)),
    );
  }

  return { store };
}
