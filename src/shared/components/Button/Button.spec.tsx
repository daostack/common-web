import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("should be clickable", () => {
    const spy = jest.fn();
    render(<Button onClick={spy}>Submit</Button>);

    fireEvent.click(screen.getByText(/Submit/i));
    expect(spy).toBeCalledTimes(1);
  });

  it("should not be clickable when disabled", () => {
    const spy = jest.fn();
    render(
      <Button onClick={spy} disabled>
        Submit
      </Button>
    );

    fireEvent.click(screen.getByText(/Submit/i));
    expect(spy).toBeCalledTimes(0);
  });
});
