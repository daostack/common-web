import React from "react";
import { mount } from "enzyme";
import { ConnectedRouter } from "connected-react-router";

import App from "./App";
import history from "../../shared/history";

describe("<App/>", () => {
  it("Renders with out crashing", () => {
    const app = mount(
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>,
    );
    expect(app.find(".App").length).toBe(1);
  });
});
