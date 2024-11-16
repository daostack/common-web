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
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import { Environment, REACT_APP_ENV } from "@/shared/constants";
import { AppState } from "@/shared/interfaces";
import rootReducer from "./reducer";
import appSagas from "./saga";
import {
  inboxTransform,
  cacheTransform,
  multipleSpacesLayoutTransform,
} from "./transforms";
import { createTransform } from "redux-persist";
import { OptimisticState } from "./states";
import { FeedItemFollowLayoutItem } from "@/shared/interfaces";
import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";

// Define the keys in CommonState that are of type Map
const mapFields: Array<keyof OptimisticState> = [
  "createdOptimisticFeedItems",
  "optimisticFeedItems",
  "optimisticInboxFeedItems",
  "optimisticDiscussionMessages",
  "instantDiscussionMessagesOrder"
];

const mapTransformer = createTransform<OptimisticState, OptimisticState>(
  (inboundState) => {
    const transformedState: OptimisticState = { ...inboundState };

    mapFields.forEach((key) => {
      const value = inboundState[key];
      if (value instanceof Map) {
        if (key === "optimisticDiscussionMessages") {
          (transformedState as any)[key] = Array.from(
            (value as Map<string, CreateDiscussionMessageDto[]>).entries()
          ) as [string, CreateDiscussionMessageDto[]][];
        } else {
          (transformedState as any)[key] = Array.from(
            (value as Map<string, FeedItemFollowLayoutItem | undefined>).entries()
          ) as [string, FeedItemFollowLayoutItem | undefined][];
        }
      }
    });

    return transformedState;
  },
  (outboundState) => {
    const transformedState: OptimisticState = { ...outboundState };

    mapFields.forEach((key) => {
      const value = outboundState[key];
      if (Array.isArray(value)) {
        if (key === "optimisticDiscussionMessages") {
          (transformedState as any)[key] = new Map(value) as Map<string, CreateDiscussionMessageDto[]>;
        } else {
          (transformedState as any)[key] = new Map(value) as Map<string, FeedItemFollowLayoutItem | undefined>;
        }
      }
    });

    return transformedState;
  },
  { whitelist: ["optimistic"] }
);


const persistConfig: PersistConfig<AppState> = {
  key: "root",
  storage,
  whitelist: [
    "optimistic",
    "projects",
    "commonLayout",
    "commonFeedFollows",
    "cache",
    "inbox",
    "multipleSpacesLayout",
  ],
  stateReconciler: autoMergeLevel2,
  transforms: [mapTransformer, inboxTransform, cacheTransform, multipleSpacesLayoutTransform],
};

const sagaMiddleware = createSagaMiddleware();
let middleware: Array<Middleware>;
// eslint-disable-next-line @typescript-eslint/ban-types
let composer: Function;

if (REACT_APP_ENV === Environment.Dev) {
  middleware = [freeze, sagaMiddleware];
  composer = composeWithDevTools({ trace: true, traceLimit: 25 });
} else {
  middleware = [sagaMiddleware];
  composer =
    REACT_APP_ENV === Environment.Production
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
// defaults to localStorage for web

export default function configureStore(history: History) {
  const persistedReducer = persistReducer(persistConfig, rootReducer(history));
  const store: Store<AppState> = createStore(
    persistedReducer,
    undefined,
    composer(
      applyMiddleware(
        ...middleware,
        routerMiddleware(history),
        errorHandlerMiddleware,
      ),
    ),
  );
  const persistor = persistStore(store);

  sagaMiddleware.run(appSagas);

  // eslint-disable-next-line
  if ((module as any).hot) {
    // eslint-disable-next-line
    (module as any).hot.accept(() =>
      store.replaceReducer(persistedReducer as any),
    );
  }

  return { store, persistor };
}
