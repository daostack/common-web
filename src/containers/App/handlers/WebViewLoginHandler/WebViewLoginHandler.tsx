import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { webviewLogin } from "@/containers/Auth/store/actions";
import { ROUTE_PATHS, WebviewActions } from "@/shared/constants";
import { FirebaseCredentials } from "@/shared/interfaces/FirebaseCredentials";
import { parseJson } from "@/shared/utils/json";

const WebViewLoginHandler: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

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
                history.push(ROUTE_PATHS.MY_COMMONS);
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
