import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Router as ReactRouter } from "react-router";
import { LoginContainer } from "@/pages/Login/containers/LoginContainer";
import { history } from "@/shared/appConfig";
import { BackgroundNotificationModal } from "@/shared/components";
import { SMALL_SCREEN_BREAKPOINT, ScreenSize } from "@/shared/constants";
import { useScreenSize } from "@/shared/hooks";
import { changeScreenSize } from "@/shared/store/actions";
import {
  CommonHandler,
  TextDirectionHandler,
  ThemeHandler,
  UserNotificationsAmountHandler,
  WebViewLoginHandler,
  NotificationsHandler,
} from "./handlers";
import { Router } from "./router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

const App = () => {
  const dispatch = useDispatch();
  const isDesktop = useScreenSize(`min-width: ${SMALL_SCREEN_BREAKPOINT}`);

  useEffect(() => {
    dispatch(
      changeScreenSize(isDesktop ? ScreenSize.Desktop : ScreenSize.Mobile),
    );
  }, [dispatch, isDesktop]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactRouter history={history}>
        <BackgroundNotificationModal />
        <CommonHandler />
        <TextDirectionHandler />
        <ThemeHandler />
        <UserNotificationsAmountHandler />
        <WebViewLoginHandler />
        <NotificationsHandler />
        <LoginContainer />
        <Router />
      </ReactRouter>
    </QueryClientProvider>
  );
};

export default App;
