import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import config from "@/config";
import PrivateRoute from "@/containers/App/PrivateRoute";
import { authentificated } from "@/containers/Auth/store/selectors";
import {
  CommonContainer,
  DiscussionContainer,
  DiscussionMessageContainer,
  ProposalCommentContainer,
  ProposalContainer,
} from "@/containers/Common";
import { MyCommonsContainer } from "@/containers/Common/containers/MyCommonsContainer";
import { SubmitInvoicesContainer } from "@/containers/Invoices";
import { ContactUsContainer, LandingContainer } from "@/containers/Landing";
import { MyAccountContainer } from "@/containers/MyAccount";
import { TrusteeContainer } from "@/containers/Trustee";
import { NotFound } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { OldLayout } from "@/shared/layouts";

const Routes: FC = () => {
  const history = useHistory();
  const isAuthenticated = useSelector(authentificated());
  const { search: queryString } = history.location;

  return (
    <OldLayout>
      <Switch>
        <Route path={ROUTE_PATHS.HOME} exact component={LandingContainer} />
        <Route
          path={ROUTE_PATHS.CONTACT_US}
          exact
          component={ContactUsContainer}
        />
        <Route path={ROUTE_PATHS.COMMON_LIST} component={CommonContainer} />
        <PrivateRoute
          path={ROUTE_PATHS.PROPOSAL_DETAIL}
          component={ProposalContainer}
          authenticated={isAuthenticated}
        />
        <PrivateRoute
          path={ROUTE_PATHS.PROPOSAL_COMMENT}
          component={ProposalCommentContainer}
          authenticated={isAuthenticated}
        />
        <PrivateRoute
          path={ROUTE_PATHS.DISCUSSION_DETAIL}
          component={DiscussionContainer}
          authenticated={isAuthenticated}
        />
        <PrivateRoute
          path={ROUTE_PATHS.DISCUSSION_MESSAGE}
          component={DiscussionMessageContainer}
          authenticated={isAuthenticated}
        />
        <PrivateRoute
          path={ROUTE_PATHS.MY_ACCOUNT}
          component={MyAccountContainer}
          authenticated={isAuthenticated}
        />
        <PrivateRoute
          path={ROUTE_PATHS.MY_COMMONS}
          component={MyCommonsContainer}
          authenticated={isAuthenticated}
        />
        <Route
          path={ROUTE_PATHS.SUBMIT_INVOICES}
          component={SubmitInvoicesContainer}
        />
        <Route path={ROUTE_PATHS.TRUSTEE} component={TrusteeContainer} />
        <Redirect
          from={ROUTE_PATHS.DEAD_SEA}
          to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
            ":id",
            config.deadSeaCommonId,
          )}${queryString}`}
        />
        <Redirect
          from={ROUTE_PATHS.PARENTS_FOR_CLIMATE}
          to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
            ":id",
            config.parentsForClimateCommonId,
          )}${queryString}`}
        />
        <Redirect
          from={ROUTE_PATHS.SAVE_SAADIA}
          to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
            ":id",
            config.saadiaCommonId,
          )}${queryString}`}
        />
        <Route component={NotFound} />
      </Switch>
    </OldLayout>
  );
};

export default Routes;
