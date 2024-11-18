import { User as FirebaseUser } from "firebase/auth";
import { call, put, takeLatest, takeLeading } from "redux-saga/effects";
import {
  getProposalById,
  seenNotification,
  subscribeToNotification,
} from "@/pages/OldCommon/store/api";
import { UserService } from "@/services";
import { persistor, store } from "@/shared/appConfig";
import { Awaited } from "@/shared/interfaces";
import { FirebaseCredentials } from "@/shared/interfaces/FirebaseCredentials";
import { EventTypeState, NotificationItem } from "@/shared/models/Notification";
import { isFundsAllocationProposal } from "@/shared/models/governance/proposals";
import { showNotification } from "@/shared/store/actions";
import { getProvider } from "@/shared/utils/authProvider";
import { getFundingRequestNotification } from "@/shared/utils/notifications";
import {
  cacheActions,
  commonActions,
  commonLayoutActions,
  inboxActions,
  multipleSpacesLayoutActions,
} from "@/store/states";
import {
  ANONYMOUS_USER_FIRST_NAME,
  ANONYMOUS_USER_LAST_NAME,
  AUTH_CODE_FOR_SIGN_UP,
  AuthProvider,
  AuthProviderID,
  ErrorCode,
  RECAPTCHA_CONTAINER_ID,
  ROUTE_PATHS,
  WebviewActions,
} from "../../../shared/constants";
import history from "../../../shared/history";
import { Collection, Proposal, User } from "../../../shared/models";
import {
  GeneralError,
  getFirebaseAuthProvider,
  getRandomUserAvatarURL,
  isAcceptedFundsAllocationToSubCommonEvent,
  isError,
  isRandomUserAvatarURL,
  tokenHandler,
  transformFirebaseDataSingle,
} from "../../../shared/utils";
import firebase from "../../../shared/utils/firebase";
import { UserCreationDto } from "../interface";
import * as actions from "./actions";
import { createdUserApi, deleteUserApi, getUserData } from "./api";
import { resetOptimisticState } from "@/store/states/optimistic/actions";

const getAuthProviderFromProviderData = (
  providerData?: firebase.User["providerData"],
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

const createUser = async (
  user: firebase.User | FirebaseUser,
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

  const splittedDisplayName = user.displayName?.split(" ") ||
    (user.email && [user.email.split("@")[0]]) || [
      ANONYMOUS_USER_FIRST_NAME,
      ANONYMOUS_USER_LAST_NAME,
    ];

  const userPhotoUrl =
    user.photoURL || getRandomUserAvatarURL(splittedDisplayName.join("+"));

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

const verifyLoggedInUser = async (
  user: firebase.User | FirebaseUser | null,
  shouldCreateUserIfNotExist: boolean,
  authCode = "",
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

  const isAllowedToCreateUser = authCode === AUTH_CODE_FOR_SIGN_UP;
  const result =
    shouldCreateUserIfNotExist && isAllowedToCreateUser
      ? await createUser(user)
      : {
          user: await getUserData(user.uid),
          isNewUser: false,
        };

  if (!result.user) {
    await firebase.auth().signOut();

    if (isAllowedToCreateUser) {
      throw new Error("User is not logged in");
    }

    throw new GeneralError({
      code: ErrorCode.CUserDoesNotExist,
    });
  }

  tokenHandler.set(token);
  tokenHandler.setUser(result.user);

  return {
    user: result.user,
    isNewUser: result.isNewUser,
  };
};

const authorizeUser = async ({
  provider: authProvider,
  authCode,
}: {
  provider: AuthProvider;
  authCode: string;
}): Promise<{ user: User; isNewUser: boolean }> => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  const provider = getFirebaseAuthProvider(authProvider);
  const { user } = await firebase.auth().signInWithPopup(provider);

  return verifyLoggedInUser(user, true, authCode);
};

const authorizeUserViaCredentials = async (
  data: FirebaseCredentials,
): Promise<firebase.User | null> => {
  let credential;
  if (data.customToken) {
    const { user } = await firebase
      .auth()
      .signInWithCustomToken(data.customToken);

    return user;
  } else if (data.providerId === AuthProviderID.Apple) {
    const provider = new firebase.auth.OAuthProvider(data.providerId);
    credential = provider.credential(data);
  } else {
    const provider = getProvider(data?.providerId);
    credential = provider.credential(data.idToken);
  }

  const { user } = await firebase.auth().signInWithCredential(credential);

  return user;
};

const loginUsingEmailAndPassword = async (
  email: string,
  password: string,
): Promise<User> => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  const { user } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  const data = await verifyLoggedInUser(user, false);

  return data.user;
};

const sendVerificationCode = async (
  phoneNumber: string,
): Promise<firebase.auth.ConfirmationResult> => {
  firebase.auth().languageCode = "en";

  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    RECAPTCHA_CONTAINER_ID,
    {
      size: "invisible",
    },
  );

  const result = await firebase
    .auth()
    .signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
  recaptchaVerifier.clear();

  return result;
};

const confirmVerificationCode = async (
  confirmation: firebase.auth.ConfirmationResult,
  code: string,
  authCode: string,
): Promise<{ user: User; isNewUser: boolean }> => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  const { user } = await confirmation.confirm(code);

  return verifyLoggedInUser(user, true, authCode);
};

const updateUserData = async (user: User): Promise<User> => {
  const currentUser = await firebase.auth().currentUser;
  const profileData: {
    displayName?: string | null;
    photoURL?: string | null;
  } = {
    displayName: `${user.firstName} ${user.lastName}`,
  };
  const photoURL =
    user.photo &&
    (isRandomUserAvatarURL(user.photo)
      ? getRandomUserAvatarURL(profileData.displayName?.replace(/\s/gi, "+"))
      : user.photo);

  if (photoURL) {
    profileData.photoURL = photoURL;
  }

  await currentUser?.updateProfile(profileData);
  const updatedCurrentUser = await firebase.auth().currentUser;

  return await UserService.updateUser({
    ...user,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    photoURL: updatedCurrentUser?.photoURL || user.photo || "",
    intro: user.intro,
    displayName: `${user.firstName} ${user.lastName}`,
    country: user.country,
    phoneNumber: user.phoneNumber || "",
  });
};

const resetGlobalData = (fullReset: boolean) => {
  if (fullReset) {
    store.dispatch(multipleSpacesLayoutActions.resetMultipleSpacesLayout());
    store.dispatch(commonLayoutActions.clearData());
  }
  store.dispatch(inboxActions.resetInbox());
  store.dispatch(cacheActions.resetFeedStates());
  store.dispatch(cacheActions.resetDiscussionMessagesStates());
  store.dispatch(cacheActions.resetChatChannelMessagesStates());
  store.dispatch(commonActions.resetCommon());
};

function* socialLoginSaga({
  payload,
}: ReturnType<typeof actions.socialLogin.request>) {
  try {
    yield put(actions.startAuthLoading());

    const { user, isNewUser }: { user: User; isNewUser: boolean } = yield call(
      authorizeUser,
      payload.payload,
    );
    const firebaseUser: User = yield call(getUserData, user.uid ?? "");
    if (firebaseUser) {
      yield put(actions.socialLogin.success(firebaseUser));
    }

    if (payload.callback) {
      payload.callback(null, { user, isNewUser });
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.socialLogin.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

function* loginWithFirebaseUserSaga({
  payload,
}: ReturnType<typeof actions.loginWithFirebaseUser.request>) {
  try {
    yield put(actions.startAuthLoading());

    const { user, isNewUser } = (yield call(
      verifyLoggedInUser,
      payload.payload.firebaseUser,
      true,
      payload.payload.authCode,
    )) as Awaited<ReturnType<typeof verifyLoggedInUser>>;
    const firebaseUser = (yield call(getUserData, user.uid ?? "")) as Awaited<
      ReturnType<typeof getUserData>
    >;

    if (firebaseUser) {
      yield put(actions.loginWithFirebaseUser.success(firebaseUser));
    }
    if (payload.callback) {
      payload.callback(null, { user, isNewUser });
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.loginWithFirebaseUser.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

export function* webviewLoginWithUserSaga({
  payload,
}: ReturnType<typeof actions.webviewLoginWithUser.request>) {
  try {
    yield put(actions.startAuthLoading());

    const { user }: { user: User } = yield call(
      verifyLoggedInUser,
      payload.payload.user,
      true,
      AUTH_CODE_FOR_SIGN_UP,
    );

    const firebaseUser: User = yield call(getUserData, user.uid ?? "");
    if (firebaseUser) {
      yield put(actions.webviewLoginWithUser.success(firebaseUser));
    }

    if (payload.callback) {
      payload.callback(true);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.webviewLoginWithUser.failure(error));
    }

    if (payload.callback) {
      payload.callback(false);
    }
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

function* webviewLoginSaga({
  payload,
}: ReturnType<typeof actions.webviewLogin.request>) {
  try {
    yield put(actions.startAuthLoading());

    const loggedFirebaseUser = yield call(
      authorizeUserViaCredentials,
      payload.payload,
    );

    const { user }: { user: User } = yield call(
      verifyLoggedInUser,
      loggedFirebaseUser,
      true,
      AUTH_CODE_FOR_SIGN_UP,
    );

    const firebaseUser: User = yield call(getUserData, user.uid ?? "");
    if (firebaseUser) {
      yield put(actions.webviewLogin.success(firebaseUser));
    }

    if (payload.callback) {
      payload.callback(true);
    }
  } catch (error) {
    window?.ReactNativeWebView?.postMessage(`toast-${JSON.stringify(error)}`);
    if (isError(error)) {
      yield put(actions.webviewLogin.failure(error));
    }

    if (payload.callback) {
      payload.callback(false);
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
      payload.payload.password,
    );
    yield put(actions.loginUsingEmailAndPassword.success(user));

    if (payload.callback) {
      payload.callback(null, user);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.loginUsingEmailAndPassword.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
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
      payload.payload,
    );
    yield put(actions.sendVerificationCode.success(confirmationResult));

    if (payload.callback) {
      payload.callback(null, confirmationResult);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.sendVerificationCode.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
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
      payload.payload.code,
      payload.payload.authCode,
    );
    yield put(actions.confirmVerificationCode.success(user));

    if (payload.callback) {
      payload.callback(null, { user, isNewUser });
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.confirmVerificationCode.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

function* logOut() {

  yield put(resetOptimisticState());
  // Wait for persistor.purge() to complete
  yield call([persistor, persistor.purge]);
  yield call([persistor, persistor.flush]);

  // Now clear localStorage
  localStorage.clear();

  // Sign out from Firebase
  yield call([firebase.auth(), firebase.auth().signOut]);

  // Notify React Native WebView if applicable
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(WebviewActions.logout);
  }

  // Reset global data and navigate to home
  resetGlobalData(true);
  history.push(ROUTE_PATHS.HOME);

  yield true;
}

function* updateUserDetails({
  payload,
}: ReturnType<typeof actions.updateUserDetails.request>) {
  try {
    yield put(actions.startAuthLoading());
    const user = (yield call(updateUserData, payload.user)) as Awaited<
      ReturnType<typeof updateUserData>
    >;

    yield put(actions.updateUserDetails.success(user));
    yield put(actions.socialLogin.success(user));
    yield put(
      cacheActions.updateUserStateById({
        userId: user.uid,
        state: {
          loading: false,
          fetched: true,
          data: user,
        },
      }),
    );
    tokenHandler.setUser(user);
    yield payload.callback(null, user);
  } catch (error) {
    if (isError(error)) {
      yield put(actions.updateUserDetails.failure(error));
      yield payload.callback(error);
    }
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

function* deleteUser({
  payload,
}: ReturnType<typeof actions.deleteUser.request>) {
  try {
    yield put(actions.startAuthLoading());

    yield call(deleteUserApi);
    yield put(actions.logOut());
    yield put(actions.deleteUser.success());

    if (payload.callback) {
      payload.callback(null);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.deleteUser.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  } finally {
    yield put(actions.stopAuthLoading());
  }
}

function* authSagas() {
  yield takeLeading(
    actions.webviewLoginWithUser.request,
    webviewLoginWithUserSaga,
  );
  yield takeLeading(actions.webviewLogin.request, webviewLoginSaga);
  yield takeLatest(actions.socialLogin.request, socialLoginSaga);
  yield takeLatest(
    actions.loginWithFirebaseUser.request,
    loginWithFirebaseUserSaga,
  );
  yield takeLatest(
    actions.loginUsingEmailAndPassword.request,
    loginUsingEmailAndPasswordSaga,
  );
  yield takeLatest(
    actions.sendVerificationCode.request,
    sendVerificationCodeSaga,
  );
  yield takeLatest(
    actions.confirmVerificationCode.request,
    confirmVerificationCodeSaga,
  );
  yield takeLatest(actions.logOut, logOut);
  yield takeLatest(actions.updateUserDetails.request, updateUserDetails);
  yield takeLatest(actions.deleteUser.request, deleteUser);
}

(async () => {
  firebase.auth().onIdTokenChanged(async (data) => {
    store.dispatch(actions.setIsAuthenticationReady(true));

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
      const { user: userInStore } = store.getState().auth;

      if (userInStore?.uid !== res?.uid) {
        resetGlobalData(!res);
      }

      store.dispatch(
        actions.setAuthProvider(
          getAuthProviderFromProviderData(res?.providerData),
        ),
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

  subscribeToNotification(async (data?: NotificationItem) => {
    const user = await firebase.auth().currentUser;

    if (data && (!data.seen || !data?.seen?.includes(user?.uid ?? ""))) {
      switch (data?.eventType) {
        case EventTypeState.fundingRequestAccepted:
        case EventTypeState.fundingRequestRejected:
          const proposal: Proposal | undefined = await getProposalById(
            data?.eventObjectId,
          );
          if (
            isFundsAllocationProposal(proposal) &&
            !isAcceptedFundsAllocationToSubCommonEvent(
              proposal.data.args.to,
              data.eventType,
            )
          ) {
            const notification = getFundingRequestNotification(data, proposal);

            store.dispatch(showNotification(notification));

            seenNotification(data.id);
          }

          break;
        default:
          break;
      }
    }
  });
})();

export default authSagas;
