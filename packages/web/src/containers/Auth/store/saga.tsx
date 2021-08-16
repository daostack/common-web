import { call, put, takeLatest } from "redux-saga/effects";
import { AnyAction } from "redux";

import { default as store } from "../../../index";
import { createApolloClient, tokenHandler } from "../../../shared/utils";
import * as actions from "./actions";
import firebase from "../../../shared/utils/firebase";
import { startLoading, stopLoading } from "../../../shared/store/actions";
import { User } from "../../../shared/models";
import { GoogleAuthResultInterface } from "../interface";
import { UpdateUserDocument, CreateUserDocument } from "../../../graphql";

const createUser = async (profile: any) => {
  const userPhotoUrl =
    profile?.picture ||
    `https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${profile?.email}&rounded=true`;

  try {
    const apollo = await createApolloClient("https://api.staging.common.io/graphql" || "", localStorage.token || "");
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

const authorizeUser = async (payload: string) => {
  const provider =
    payload === "google" ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.OAuthProvider("apple.com");

  return await firebase
    .auth()
    .signInWithPopup(provider)
    .then(async (result) => {
      const credentials = result.credential?.toJSON() as GoogleAuthResultInterface;
      const user = result.user?.toJSON() as User;
      const currentUser = await firebase.auth().currentUser;
      if (credentials && user) {
        const tk = await currentUser?.getIdToken(true);
        if (tk) {
          tokenHandler.set(tk);
          tokenHandler.setUser(user);
        }
      }
      if (result.additionalUserInfo?.isNewUser) {
        await createUser(result.additionalUserInfo?.profile);

        store.dispatch(actions.setIsUserNew(true));
      }
      return currentUser;
    });
};

const updateUserData = async (user: any) => {
  const currentUser = await firebase.auth().currentUser;
  await currentUser?.updateProfile({ displayName: `${user.firstName} ${user.lastName}` });

  const apollo = await createApolloClient("https://api.staging.common.io/graphql" || "", localStorage.token || "");
  const { data } = await apollo.mutate({
    mutation: UpdateUserDocument,
    variables: {
      user: {
        id: currentUser?.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: currentUser?.photoURL,
        country: user.country || "",
      },
    },
  });

  return data;
};

function* socialLoginSaga({ payload }: AnyAction & { payload: string }) {
  try {
    yield put(startLoading());

    const user: User = yield call(authorizeUser, payload);

    yield put(actions.socialLogin.success(user));
  } catch (error) {
    yield put(actions.socialLogin.failure(error));
  } finally {
    yield put(stopLoading());
  }
}

function* logOut() {
  yield firebase.auth().signOut();

  localStorage.clear();
}

function* updateUserDetails({ payload }: ReturnType<typeof actions.updateUserDetails.request>) {
  try {
    yield put(startLoading());
    const user: User = yield call(updateUserData, payload);
    yield put(actions.updateUserDetails.success(user));
    yield put(actions.setIsUserNew(false));
  } catch (error) {
    yield put(actions.updateUserDetails.failure(error));
  } finally {
    yield put(stopLoading());
  }
}

function* authSagas() {
  yield takeLatest(actions.socialLogin.request, socialLoginSaga);
  yield takeLatest(actions.logOut, logOut);
  yield takeLatest(actions.updateUserDetails.request, updateUserDetails);
}

export default authSagas;
