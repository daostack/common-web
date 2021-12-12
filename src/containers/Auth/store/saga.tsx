import { call, put, takeLatest } from "redux-saga/effects";
import { AnyAction } from "redux";

import { default as store } from "../../../index";
import { tokenHandler } from "../../../shared/utils";
import * as actions from "./actions";
import firebase from "../../../shared/utils/firebase";
import { startLoading, stopLoading } from "../../../shared/store/actions";
import { User } from "../../../shared/models";
import { GoogleAuthResultInterface } from "../interface";

import { ROUTE_PATHS } from "../../../shared/constants";
import history from "../../../shared/history";

const saveTokenToDatabase = async (token: string) => {
  const currentUser = await firebase.auth().currentUser;
  if (currentUser) {
    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser?.uid)
      .update({
        tokens: firebase.firestore.FieldValue.arrayUnion(token),
      })
      .then(() => {
        console.log("FCM token updated");
      })
      .catch((err) => console.error(err));
  }
};

const createUser = async (user: firebase.User) => {
  if (!user) return;
  const splittedDisplayName = user?.displayName?.split(" ") || [
    user?.email?.split("@")[0],
  ];

  const userPhotoUrl = user.photoURL
    ? user.photoURL
    : `https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${
        user.displayName ? user.displayName : user.email
      }&rounded=true`;

  const userPublicData = {
    createdAt: new Date(),
    firstName: splittedDisplayName[0] || "",
    lastName: splittedDisplayName[1] || "",
    email: user.email,
    photoURL: userPhotoUrl,
    uid: user.uid,
  };

  const userSnapshot = await firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get();
  if (userSnapshot.exists) {
    return;
  }

  return await firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set(userPublicData);
};

export const uploadImage = async (imageUri: any) => {
  const ext = imageUri.split(";")[0].split("/")[1];
  const timeStamp = new Date().getTime();
  const filename = `img_${timeStamp}.${ext}`;
  const path = `public_img/${filename}`;
  const ref = firebase.storage().ref(path);

  await ref.putString(imageUri.split(",")[1], "base64", {
    contentType: `image/${ext}`,
  });
  return await ref.getDownloadURL();
};

const authorizeUser = async (payload: string) => {
  const provider =
    payload === "google"
      ? new firebase.auth.GoogleAuthProvider()
      : new firebase.auth.OAuthProvider("apple.com");

  if (payload !== "google") {
    provider.addScope("email");
    provider.addScope("name");
  }

  return await firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(async () => {
      return await firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          const credentials = result.credential?.toJSON() as GoogleAuthResultInterface;
          const user = result.user?.toJSON() as User;
          const currentUser = (await firebase.auth().currentUser) as any;

          let loginedUser: any;
          if (result.additionalUserInfo?.isNewUser) {
            store.dispatch(actions.setIsUserNew(true));
          }
          if (credentials && user) {
            const tk = await currentUser?.getIdToken(true);
            if (tk) {
              tokenHandler.set(tk);

              if (currentUser) {
                loginedUser = currentUser;
                store.dispatch(actions.socialLogin.success(currentUser));
                tokenHandler.setUser(currentUser);
              }
            }
          }

          return loginedUser;
        });
    })
    .catch((e) => console.log(e));
};

const updateUserData = async (user: any) => {
  const currentUser = await firebase.auth().currentUser;
  await currentUser?.updateProfile({
    displayName: `${user.firstName} ${user.lastName}`,
    photoURL: user.photo,
  });

  const updatedCurrentUser = await firebase.auth().currentUser;

  if (store.getState().auth.isNewUser) {
    if (updatedCurrentUser) {
      await createUser(updatedCurrentUser);
    }
  }

  return updatedCurrentUser;
};

function* socialLoginSaga({ payload }: AnyAction & { payload: string }) {
  try {
    yield put(startLoading());

    const user: User = yield call(authorizeUser, payload);
    if (user) {
      yield put(actions.socialLogin.success(user));
    }
  } catch (error) {
    yield put(actions.socialLogin.failure(error));
  } finally {
    yield put(stopLoading());
  }
}

function* logOut() {
  localStorage.clear();
  firebase.auth().signOut();

  if (window.location.pathname === ROUTE_PATHS.MY_COMMONS) {
    history.push("/");
  }
  yield true;
}

function* updateUserDetails({
  payload,
}: ReturnType<typeof actions.updateUserDetails.request>) {
  try {
    yield put(startLoading());
    const user: User = yield call(updateUserData, payload.user);

    yield put(actions.updateUserDetails.success(user));
    tokenHandler.setUser(user);
    yield put(actions.setIsUserNew(false));
    yield payload.callback();
  } catch (error) {
    yield put(actions.updateUserDetails.failure(error));
    yield payload.callback();
  } finally {
    yield put(stopLoading());
  }
}

function* authSagas() {
  yield takeLatest(actions.socialLogin.request, socialLoginSaga);
  yield takeLatest(actions.logOut, logOut);
  yield takeLatest(actions.updateUserDetails.request, updateUserDetails);
}

(async () => {
  firebase.auth().onIdTokenChanged(async (data) => {
    const newToken = await data?.getIdToken();
    const currentToken = tokenHandler.get();
    if (newToken !== currentToken && currentToken) {
      if (newToken) {
        tokenHandler.set(newToken);
        await saveTokenToDatabase(newToken);
      } else {
        logOut().next();
      }
    }
  });

  firebase.auth().onAuthStateChanged(async (res) => {
    try {
      if (tokenHandler.get()) {
        const currentUser: User | undefined = res?.toJSON() as any;

        if (currentUser) {
          const userSnapshot = await firebase
            .firestore()
            .collection("users")
            .where("uid", "==", currentUser.uid)
            .get();

          if (userSnapshot.docs.length) {
            const user: User = (userSnapshot.docs[0].data() as unknown) as User;
            if (user) {
              store.dispatch(actions.updateUserDetails.success(user));
              tokenHandler.setUser(user);
            }
          }
        }
      }
    } catch (e) {
      logOut().next();
    }
  });
})();

export default authSagas;
