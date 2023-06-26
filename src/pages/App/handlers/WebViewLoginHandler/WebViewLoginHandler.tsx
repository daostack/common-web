import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { webviewLogin } from "@/pages/Auth/store/actions";
import { history } from "@/shared/appConfig";
import { WebviewActions } from "@/shared/constants";
import { FirebaseCredentials } from "@/shared/interfaces/FirebaseCredentials";
import { getInboxPagePath } from "@/shared/utils";
import { parseJson } from "@/shared/utils/json";

const WebViewLoginHandler: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const data = parseJson(event.data) as FirebaseCredentials;
      if (!data?.providerId) {
        return;
      }

      try {
        dispatch(
          webviewLogin.request({
            payload: data,
            callback: (isLoggedIn) => {
              if (isLoggedIn) {
                window.ReactNativeWebView.postMessage(
                  WebviewActions.loginSuccess,
                );
                history.push(getInboxPagePath());
              } else {
                window.ReactNativeWebView.postMessage(
                  WebviewActions.loginError,
                );
              }
            },
          }),
        );
      } catch (err) {
        window.ReactNativeWebView.postMessage(WebviewActions.loginError);
      }
    });
  }, []);

  return null;
};

export default WebViewLoginHandler;
