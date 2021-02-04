import { createStore, applyMiddleware, compose, Middleware, Dispatch } from "redux";
import { History } from "history";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import freeze from "redux-freeze";
import createSagaMiddleware from "redux-saga";

import appSagas from "./saga";
import rootReducer from "./reducer";

const sagaMiddleware = createSagaMiddleware();
let middleware: Array<Middleware>;
// eslint-disable-next-line @typescript-eslint/ban-types
let composer: Function;

if (process.env.NODE_ENV === "development") {
  middleware = [freeze, sagaMiddleware];
  composer = composeWithDevTools({ trace: true, traceLimit: 25 });
} else {
  middleware = [sagaMiddleware];
  composer = compose;
}

const errorHandlerMiddleware: Middleware = () => (next: Dispatch) => (action) => {
  if (action.type.includes("FAILURE")) {
    // next(
    //   showNotification({
    //     message: action.payload.error || action.payload.message,
    //     appearance: "error",
    //   }),
    // );

    if (action.payload && (action.payload.code === 401 || action.payload.code === 403)) {
      localStorage.clear();
    }
  }

  if (action.type.includes("SUCCESS") && action.payload && action.payload.message) {
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
  const store = createStore(
    rootReducer(history),
    undefined,
    composer(applyMiddleware(...middleware, routerMiddleware(history), errorHandlerMiddleware)),
  );

  sagaMiddleware.run(appSagas);

  // eslint-disable-next-line
  if ((module as any).hot) {
    // eslint-disable-next-line
    (module as any).hot.accept(() => store.replaceReducer(rootReducer(history)));
  }

  return { store };
}
