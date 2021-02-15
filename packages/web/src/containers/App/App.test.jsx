import React from "react";
import { mount } from "enzyme";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";

import App from "./App";
import history from "../../shared/history";
import configureStore from "../../store/store";
const { store } = configureStore(history);

describe("<App/>", () => {
  it("Renders with out crashing", () => {
    const app = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>,
    );
    expect(app.find(".App").length).toBe(1);
  });
});
