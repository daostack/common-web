import { call, put, takeLatest } from "redux-saga/effects";
import { default as store } from "../../../index";
import {
  getRandomUserAvatarURL,
  tokenHandler,
  transformFirebaseDataSingle,
} from "../../../shared/utils";
import * as actions from "./actions";
import firebase from "../../../shared/utils/firebase";
import { Collection, User } from "../../../shared/models";
import { UserCreationDto } from "../interface";
import {
  AuthProvider,
  RECAPTCHA_CONTAINER_ID,
  ROUTE_PATHS,
} from "../../../shared/constants";
import history from "../../../shared/history";
import { createdUserApi } from "./api";

const getAuthProviderFromProviderData = (
  providerData?: firebase.User["providerData"]
): AuthProvider | null => {
  if (!providerData) {
    return null;
  }

  const item = providerData.find((item) => Boolean(item?.providerId));

  switch (item?.providerId) {
    case "apple.com":
      return AuthProvider.Apple;
    case "facebook.com":
      return AuthProvider.Facebook;
    case "google.com":
      return AuthProvider.Google;
    case "phone":
      return AuthProvider.Phone;
    default:
      return null;
  }
};

const getUserData = async (userId: string) => {
  const userSnapshot = await firebase
    .firestore()
    .collection(Collection.Users)
    .where("uid", "==", userId)
    .get();

  if (userSnapshot.docs.length) {
    const user: User = (userSnapshot.docs[0].data() as unknown) as User;
    return user;
  }
  return null;
};

const saveTokenToDatabase = async (token: string) => {
  const currentUser = await firebase.auth().currentUser;
  if (currentUser) {
    await firebase
      .firestore()
      .collection(Collection.Users)
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

const createUser = async (
  user: firebase.User
): Promise<{ user: User; isNewUser: boolean }> => {
  const userSnapshot = await firebase
    .firestore()
    .collection(Collection.Users)
    .doc(user.uid)
    .get();

  if (userSnapshot.exists) {
    return {
      user: transformFirebaseDataSingle<User>(userSnapshot),
      isNewUser: false,
    };
  }

  const splittedDisplayName = user.displayName?.split(" ") || [
    user.email?.split("@")[0] || user.phoneNumber,
  ];

  const userPhotoUrl =
    user.photoURL || getRandomUserAvatarURL(user.displayName || user.email);

  const userPublicData: UserCreationDto = {
    firstName: splittedDisplayName[0] || "",
    lastName:
      (splittedDisplayName.length >= 2
        ? splittedDisplayName[1]
        : splittedDisplayName[0]) || "",
    displayName: user.displayName || "",
    phoneNumber: user.phoneNumber || "",
    photoURL: userPhotoUrl,
  };
  const createdUser = await createdUserApi(userPublicData);

  return {
    user: createdUser,
    isNewUser: true,
  };
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

const getFirebaseAuthProvider = (
  authProvider: AuthProvider
): firebase.auth.GoogleAuthProvider | firebase.auth.OAuthProvider => {
  switch (authProvider) {
    case AuthProvider.Apple: {
      const provider = new firebase.auth.OAuthProvider("apple.com");
      provider.addScope("email");
      provider.addScope("name");

      return provider;
    }
    case AuthProvider.Facebook:
      return new firebase.auth.FacebookAuthProvider();
    default:
      return new firebase.auth.GoogleAuthProvider();
  }
};

const verifyLoggedInUser = async (
  user: firebase.User | null,
  shouldCreateUserIfNotExist = false
): Promise<{ user: User; isNewUser: boolean }> => {
  if (!user) {
    await firebase.auth().signOut();
    throw new Error("User is not logged in");
  }

  const token = await user.getIdToken(true);

  if (!token) {
    await firebase.auth().signOut();
    throw new Error("User is not logged in");
  }

  const result = shouldCreateUserIfNotExist
    ? await createUser(user)
    : {
        user: await getUserData(user.uid),
        isNewUser: false,
      };

  if (!result.user) {
    await firebase.auth().signOut();
    throw new Error("User is not logged in");
  }

  tokenHandler.set(token);
  tokenHandler.setUser(result.user);

  return {
    user: result.user,
    isNewUser: result.isNewUser,
  };
};

const authorizeUser = async (
  authProvider: AuthProvider
): Promise<{ user: User; isNewUser: boolean }> => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  const provider = getFirebaseAuthProvider(authProvider);
  const { user } = await firebase.auth().signInWithPopup(provider);

  return verifyLoggedInUser(user, true);
};

const loginUsingEmailAndPassword = async (
  email: string,
  password: string
): Promise<User> => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  const { user } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  const data = await verifyLoggedInUser(user);

  return data.user;
};

const sendVerificationCode = async (
  phoneNumber: string
): Promise<firebase.auth.ConfirmationResult> => {
  firebase.auth().languageCode = "en";

  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    RECAPTCHA_CONTAINER_ID,
    {
      size: "invisible",
    }
  );

  const result = await firebase
    .auth()
    .signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
  recaptchaVerifier.clear();

  return result;
};

const confirmVerificationCode = async (
  confirmation: firebase.auth.ConfirmationResult,
  code: string
): Promise<{ user: User; isNewUser: boolean }> => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  const { user } = await confirmation.confirm(code);

  return verifyLoggedInUser(user, true);
};

const updateUserData = async (user: User) => {
  const currentUser = await firebase.auth().currentUser;
  await currentUser?.updateProfile({
    displayName: `${user.firstName} ${user.lastName}`,
    photoURL: user.photo,
  });

  const updatedCurrentUser = await firebase.auth().currentUser;

  if (updatedCurrentUser) {
    await firebase
      .firestore()
      .collection(Collection.Users)
      .doc(updatedCurrentUser?.uid)
      .update({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photoURL: user.photo,
        displayName: `${user.firstName} ${user.lastName}`,
        country: user.country,
      })
      .then(async () => {
        const updatedCurrentUser = await firebase.auth().currentUser;

        if (updatedCurrentUser) {
          const databaseUser = await getUserData(updatedCurrentUser?.uid ?? "");
          if (databaseUser) {
            store.dispatch(actions.socialLogin.success(databaseUser));
          }
        }

        return updatedCurrentUser;
      })
      .catch((err) => console.error(err));
  }

  return getUserData(updatedCurrentUser?.uid ?? "");
};

function* socialLoginSaga({
  payload,
}: ReturnType<typeof actions.socialLogin.request>) {
  try {
    yield put(actions.startAuthLoading());

    const { user, isNewUser }: { user: User; isNewUser: boolean } = yield call(
      authorizeUser,
      payload.payload
    );
    const firebaseUser: User = yield call(getUserData, user.uid ?? "");
    if (firebaseUser) {
      yield put(actions.socialLogin.success(firebaseUser));
    }

    if (payload.callback) {
      payload.callback(null, { user, isNewUser });
    }
  } catch (error) {
    yield put(actions.socialLogin.failure(error));

    if (payload.callback) {
      payload.callback(error);
    }
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

function* loginUsingEmailAndPasswordSaga({
  payload,
}: ReturnType<typeof actions.loginUsingEmailAndPassword.request>) {
  try {
    yield put(actions.startAuthLoading());

    const user: User = yield call(
      loginUsingEmailAndPassword,
      payload.payload.email,
      payload.payload.password
    );
    yield put(actions.loginUsingEmailAndPassword.success(user));

    if (payload.callback) {
      payload.callback(null, user);
    }
  } catch (error) {
    yield put(actions.loginUsingEmailAndPassword.failure(error));

    if (payload.callback) {
      payload.callback(error);
    }
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

function* sendVerificationCodeSaga({
  payload,
}: ReturnType<typeof actions.sendVerificationCode.request>) {
  try {
    yield put(actions.startAuthLoading());

    const confirmationResult: firebase.auth.ConfirmationResult = yield call(
      sendVerificationCode,
      payload.payload
    );
    yield put(actions.sendVerificationCode.success(confirmationResult));

    if (payload.callback) {
      payload.callback(null, confirmationResult);
    }
  } catch (error) {
    yield put(actions.sendVerificationCode.failure(error));

    if (payload.callback) {
      payload.callback(error);
    }
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

function* confirmVerificationCodeSaga({
  payload,
}: ReturnType<typeof actions.confirmVerificationCode.request>) {
  try {
    yield put(actions.startAuthLoading());

    const { user, isNewUser }: { user: User; isNewUser: boolean } = yield call(
      confirmVerificationCode,
      payload.payload.confirmation,
      payload.payload.code
    );
    yield put(actions.confirmVerificationCode.success(user));

    if (payload.callback) {
      payload.callback(null, { user, isNewUser });
    }
  } catch (error) {
    yield put(actions.confirmVerificationCode.failure(error));

    if (payload.callback) {
      payload.callback(error);
    }
  } finally {
    yield put(actions.stopAuthLoading());
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
    yield put(actions.startAuthLoading());
    const user: User = yield call(updateUserData, payload.user);

    yield put(actions.updateUserDetails.success(user));
    tokenHandler.setUser(user);
    yield payload.callback();
  } catch (error) {
    yield put(actions.updateUserDetails.failure(error));
    yield payload.callback();
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

function* authSagas() {
  yield takeLatest(actions.socialLogin.request, socialLoginSaga);
  yield takeLatest(
    actions.loginUsingEmailAndPassword.request,
    loginUsingEmailAndPasswordSaga
  );
  yield takeLatest(
    actions.sendVerificationCode.request,
    sendVerificationCodeSaga
  );
  yield takeLatest(
    actions.confirmVerificationCode.request,
    confirmVerificationCodeSaga
  );
  yield takeLatest(actions.logOut, logOut);
  yield takeLatest(actions.updateUserDetails.request, updateUserDetails);
}

(async () => {
  firebase.auth().onIdTokenChanged(async (data) => {
    store.dispatch(actions.setIsAuthenticationReady(true));

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
      store.dispatch(
        actions.setAuthProvider(
          getAuthProviderFromProviderData(res?.providerData)
        )
      );
      store.dispatch(actions.setUserPhoneNumber(res?.phoneNumber || null));

      if (tokenHandler.get()) {
        const currentUser: User | undefined = res?.toJSON() as any;

        if (currentUser) {
          const user = await getUserData(currentUser.uid ?? "");

          if (user) {
            store.dispatch(actions.updateUserDetails.success(user));
            tokenHandler.setUser(user);
          }
        }
      }
    } catch (e) {
      logOut().next();
    }
  });
})();

export default authSagas;
