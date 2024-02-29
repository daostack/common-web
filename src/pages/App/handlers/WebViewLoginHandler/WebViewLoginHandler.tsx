import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { webviewLogin } from "@/pages/Auth/store/actions";
import { history } from "@/shared/appConfig";
import { Theme, WebviewActions } from "@/shared/constants";
import { FirebaseCredentials } from "@/shared/interfaces/FirebaseCredentials";
import { getInboxPagePath } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { parseJson } from "@/shared/utils/json";

const WebViewLoginHandler: FC = () => {
  const dispatch = useDispatch();

  const handleWebviewLogin = React.useCallback(async (event) => {
    const data = parseJson(event.data) as FirebaseCredentials;
    const user = await firebase.auth().currentUser;

    if (data?.redirectUrl) {
      history.push(data?.redirectUrl);
    }

    if (!data?.providerId) {
      return;
    }

    if (user) {
      window.ReactNativeWebView.postMessage(WebviewActions.loginSuccess);
    }

    try {
      dispatch(
        webviewLogin.request({
          payload: data,
          callback: (isLoggedIn) => {
            if (isLoggedIn) {
              const isDarkThemePreferred = window.matchMedia(
                `(prefers-color-scheme: ${Theme.Dark})`,
              );

              if (isDarkThemePreferred) {
                window.ReactNativeWebView.postMessage(Theme.Dark);
              }
              window.ReactNativeWebView.postMessage("toast-loggedIn");
              window.ReactNativeWebView.postMessage(
                WebviewActions.loginSuccess,
              );
              history.push(getInboxPagePath());
            } else {
              window.ReactNativeWebView.postMessage("toast-loginError");
              window.ReactNativeWebView.postMessage(WebviewActions.loginError);
            }
          },
        }),
      );
    } catch (err) {
      window.ReactNativeWebView.postMessage(WebviewActions.loginError);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleWebviewLogin);
  }, []);

  return null;
};

export default WebViewLoginHandler;
