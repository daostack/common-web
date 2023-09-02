import firebase from "./firebase";
import { stringifyQuery } from "./stringifyQuery";

if (typeof window !== "undefined") {
  const debugQuery = firebase
    .firestore()
    .collection("DEBUG")
    .where("DEBUG", "==", "DEBUG");
  // @ts-expect-error Accessing private property
  const originalGet = debugQuery.__proto__.get;
  // @ts-expect-error Accessing private property
  debugQuery.__proto__.get = function () {
    console.log(
      `%cQuery.get%c\n ${stringifyQuery(this)}`,
      "background: #3c802b; color: white; font-weight: bold",
      "",
    );
    // eslint-disable-next-line prefer-rest-params
    return originalGet.apply(this, arguments);
  };
  // @ts-expect-error Accessing private property
  const originalOnSnapshot = debugQuery.__proto__.onSnapshot;
  // @ts-expect-error Accessing private property
  debugQuery.__proto__.onSnapshot = function () {
    console.log(
      `%cQuery.subscribe%c\n ${stringifyQuery(this)}`,
      "background: #3c3585; color: white; font-weight: bold",
      "",
    );
    // eslint-disable-next-line prefer-rest-params
    return originalOnSnapshot.apply(this, arguments);
  };

  const debugDoc = firebase.firestore().collection("DEBUG").doc("DEBUG");
  // @ts-expect-error Accessing private property
  const originalDocGet = debugDoc.__proto__.get;
  // @ts-expect-error Accessing private property
  debugDoc.__proto__.get = function () {
    console.log(
      `%cDoc.get%c\n ${this._delegate.path}`,
      "background: #3c802b; color: white; font-weight: bold",
      "",
    );
    // eslint-disable-next-line prefer-rest-params
    return originalDocGet.apply(this, arguments);
  };

  // @ts-expect-error Accessing private property
  const originalDocOnSnapshot = debugDoc.__proto__.onSnapshot;
  // @ts-expect-error Accessing private property
  debugDoc.__proto__.onSnapshot = function () {
    console.log(
      `%cDoc.subscribe%c\n ${this._delegate.path}`,
      "background: #3c3585; color: white; font-weight: bold",
      "",
    );
    // eslint-disable-next-line prefer-rest-params
    return originalDocOnSnapshot.apply(this, arguments);
  };
}
