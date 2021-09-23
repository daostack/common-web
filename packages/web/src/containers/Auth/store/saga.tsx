import { call, put, takeLatest } from "redux-saga/effects";
import { AnyAction } from "redux";

import { default as store } from "../../../index";
import { createApolloClient, tokenHandler } from "../../../shared/utils";
import * as actions from "./actions";
import firebase from "../../../shared/utils/firebase";
import { startLoading, stopLoading } from "../../../shared/store/actions";
import { User } from "../../../shared/models";
import { GoogleAuthResultInterface } from "../interface";
import { UpdateUserDocument, CreateUserDocument, LoadUserContextDocument } from "../../../graphql";
import { ROUTE_PATHS, GRAPH_QL_URL } from "../../../shared/constants";
import history from "../../../shared/history";

const apollo = createApolloClient(GRAPH_QL_URL || "", localStorage.token || "");

export const uploadImage = async (imageUri: any) => {
  const ext = imageUri.split(";")[0].split("/")[1];
  const timeStamp = new Date().getTime();
  const filename = `img_${timeStamp}.${ext}`;
  const path = `public_img/${filename}`;
  const ref = firebase.storage().ref(path);

  await ref.putString(imageUri.split(",")[1], "base64", { contentType: `image/${ext}` });
  return await ref.getDownloadURL();
};

const createUser = async (profile: any) => {
  const userPhotoUrl =
    profile?.picture ||
    `https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${profile?.email}&rounded=true`;

  try {
    const { data } = await apollo.mutate({
      mutation: CreateUserDocument,
      variables: {
        user: {
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          photo: userPhotoUrl,
          country: "Unknown",
        },
      },
    });

    return data?.user;
  } catch (error) {
    console.error("createUser - Error -> ", error);
  }
};

const fetchCurrentUser = async () => {
  const token = localStorage.getItem("token");
  const updatedApollo = createApolloClient(GRAPH_QL_URL, token || "");
  const { data } = await updatedApollo.query({
    query: LoadUserContextDocument,
  });

  return data?.user;
};

const authorizeUser = async (payload: string) => {
  const provider =
    payload === "google" ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.OAuthProvider("apple.com");

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
          if (credentials && user && !result.additionalUserInfo?.isNewUser) {
            const tk = await currentUser?.getIdToken(true);
            if (tk) {
              tokenHandler.set(tk);
              const currentUser = await fetchCurrentUser();

              if (currentUser) {
                loginedUser = currentUser;
                store.dispatch(actions.socialLogin.success(currentUser));
                tokenHandler.setUser(currentUser);
              }
            }
          }
          if (result.additionalUserInfo?.isNewUser) {
            const createdUser = await createUser(result.additionalUserInfo?.profile);
            if (createdUser) {
              loginedUser = createdUser;
            }
            store.dispatch(actions.setIsUserNew(true));
          }
          return loginedUser;
        });
    })
    .catch((e) => console.log(e));
};

const updateUserData = async (user: any) => {
  const currentUser = await firebase.auth().currentUser;
  await currentUser?.updateProfile({ displayName: `${user.firstName} ${user.lastName}`, photoURL: user.photo });

  const updatedCurrentUser = await firebase.auth().currentUser;

  const { data } = await apollo.mutate({
    mutation: UpdateUserDocument,
    variables: {
      user: {
        id: updatedCurrentUser?.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: updatedCurrentUser?.photoURL,
        country: user.country || "",
      },
    },
  });

  return data.updateUser;
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

function* updateUserDetails({ payload }: ReturnType<typeof actions.updateUserDetails.request>) {
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
  firebase.auth().onAuthStateChanged(async (data) => {
    const newToken = await data?.getIdToken();
    const currentToken = tokenHandler.get();
    if (newToken !== currentToken && currentToken) {
      if (newToken) {
        tokenHandler.set(newToken);
      } else {
        logOut().next();
      }
    }
  });

  firebase.auth().onAuthStateChanged(async (res) => {
    try {
      if (tokenHandler.get()) {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          store.dispatch(actions.updateUserDetails.success(currentUser));
          tokenHandler.setUser(currentUser);
        }
      }
    } catch (e) {
      // logOut().next();
    }
  });
})();

export default authSagas;
