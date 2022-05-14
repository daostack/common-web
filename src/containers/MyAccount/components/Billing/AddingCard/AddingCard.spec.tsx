import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import AddingCard from "./AddingCard";

describe("AddingCard", () => {
  it("should display correct text", () => {
    render(
      <AddingCard
        text="Add bank account details"
        imageSrc="imageSrc"
        imageAlt="imageAlt"
        buttonText="Submit"
        onClick={() => {}}
      />
    );

    expect(screen.getByText(/Add bank account details/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  it("should display correct text", () => {
    const spy = jest.fn();
    render(
      <AddingCard
        text="Add bank account details"
        imageSrc="imageSrc"
        imageAlt="imageAlt"
        buttonText="Submit"
        onClick={spy}
      />
    );

    fireEvent.click(screen.getByText(/Submit/i));
    expect(spy).toBeCalledTimes(1);
  });
});
