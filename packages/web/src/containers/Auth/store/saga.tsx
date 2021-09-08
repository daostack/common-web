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
import { ROUTE_PATHS } from "../../../shared/constants";

const apollo = createApolloClient("https://api.staging.common.io/graphql" || "", localStorage.token || "");

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

const authorizeUser = async (payload: string) => {
  const provider =
    payload === "google" ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.OAuthProvider("apple.com");

  return await firebase
    .auth()
    .signInWithPopup(provider)
    .then(async (result) => {
      const credentials = result.credential?.toJSON() as GoogleAuthResultInterface;
      const user = result.user?.toJSON() as User;
      const currentUser = (await firebase.auth().currentUser) as any;
      if (credentials && user) {
        const tk = await currentUser?.getIdToken(true);
        if (tk) {
          tokenHandler.set(tk);
          tokenHandler.setUser(currentUser);
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
  await currentUser?.updateProfile({ displayName: `${user.firstName} ${user.lastName}`, photoURL: user.photo });

  const updatedCurrentUser = await firebase.auth().currentUser;

  const { data } = await apollo.mutate({
    mutation: UpdateUserDocument,
    variables: {
      user: {
        id: currentUser?.uid,
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
  if (window.location.pathname === ROUTE_PATHS.MY_COMMONS) {
    window.location.href = "/";
  }
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

export default authSagas;
