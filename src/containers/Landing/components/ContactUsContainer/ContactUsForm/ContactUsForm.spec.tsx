import React from "react";
import { FORM_ERROR_MESSAGES } from "@/shared/constants";
import withTestId from "@/shared/utils/tests/withTestId";
import { act, fireEvent, render, screen } from "@/shared/utils/tests";
import ContactUsForm from "./ContactUsForm";

jest.mock("@/shared/components", () => {
  const module = jest.requireActual("@/shared/components");

  return {
    ...module,
    Loader: jest.fn(withTestId("loader")),
  };
});

const fillFormWithValidData = async () => {
  await act(async () => {
    await fireEvent.change(screen.getByLabelText("Your name"), {
      target: { value: "Client Name" },
    });
    await fireEvent.change(
      screen.getByLabelText(
        "What is the title of the Common you want to launch?"
      ),
      {
        target: { value: "Common title" },
      }
    );
    await fireEvent.change(
      screen.getByLabelText(
        "Please tell us a bit about the initiative and the people behind it"
      ),
      {
        target: { value: "Description" },
      }
    );
    await fireEvent.change(screen.getByLabelText("Where are you from?"), {
      target: { value: "Belarus" },
    });
    await fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "email@example.com" },
    });
    await fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+9720512345" },
    });
    await fireEvent.blur(screen.getByLabelText("Phone number"));

    // Last changed field should be explicitly blurred
  });
};

const submitForm = async () => {
  await act(async () => {
    await fireEvent.click(screen.getByRole("button"));
  });
};

const testFieldRequiredErrorOnBlur = async (element: HTMLElement) => {
  await act(async () => {
    fireEvent.focus(element);
    fireEvent.blur(element);
  });
  expect(screen.getByText(FORM_ERROR_MESSAGES.REQUIRED)).toBeInTheDocument();
};

const testFormWithoutErrors = async () => {
  await fillFormWithValidData();
  expect(
    screen.queryByText(FORM_ERROR_MESSAGES.REQUIRED)
  ).not.toBeInTheDocument();
  expect(screen.queryByText(FORM_ERROR_MESSAGES.EMAIL)).not.toBeInTheDocument();
  expect(
    screen.queryByText(FORM_ERROR_MESSAGES.PHONE_NUMBER)
  ).not.toBeInTheDocument();
};

const testFieldWithInvalidData = async (
  element: HTMLElement,
  mockOnSubmit: () => {},
  value: string,
  errorText: string
) => {
  await act(async () => {
    await fireEvent.change(element, {
      target: { value },
    });
  });
  expect(screen.getByText(errorText)).toBeInTheDocument();
  await submitForm();
  expect(mockOnSubmit).not.toHaveBeenCalled();
};

const testFieldRequiredValidation = async (
  element: HTMLElement,
  mockOnSubmit: () => {}
) => {
  await testFieldRequiredErrorOnBlur(element);
  await testFormWithoutErrors();
  await testFieldWithInvalidData(
    element,
    mockOnSubmit,
    "",
    FORM_ERROR_MESSAGES.REQUIRED
  );
};

describe("ContactUsForm", () => {
  it("should submit the form for valid data", async () => {
    const mockOnSubmit = jest.fn();
    render(<ContactUsForm onSubmit={mockOnSubmit} />);

    await fillFormWithValidData();
    await submitForm();

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("should work correctly in loading state", () => {
    render(<ContactUsForm onSubmit={() => {}} isLoading />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should display error text", () => {
    const errorText = "Error during submission";
    render(<ContactUsForm onSubmit={() => {}} errorText={errorText} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  it("should display error for invalid name field", async () => {
    const mockOnSubmit = jest.fn();
    render(<ContactUsForm onSubmit={mockOnSubmit} />);

    const element = screen.getByLabelText("Your name");
    await testFieldRequiredValidation(element, mockOnSubmit);
  });

  it("should display error for invalid common title field", async () => {
    const mockOnSubmit = jest.fn();
    render(<ContactUsForm onSubmit={mockOnSubmit} />);

    const element = screen.getByLabelText(
      "What is the title of the Common you want to launch?"
    );
    await testFieldRequiredValidation(element, mockOnSubmit);
  });

  it("should display error for invalid description field", async () => {
    const mockOnSubmit = jest.fn();
    render(<ContactUsForm onSubmit={mockOnSubmit} />);

    const element = screen.getByLabelText(
      "Please tell us a bit about the initiative and the people behind it"
    );
    await testFieldRequiredValidation(element, mockOnSubmit);
  });

  it("should display error for invalid residence field", async () => {
    const mockOnSubmit = jest.fn();
    render(<ContactUsForm onSubmit={mockOnSubmit} />);

    const element = screen.getByLabelText("Where are you from?");
    await testFieldRequiredValidation(element, mockOnSubmit);
  });

  it("should display error for invalid email field", async () => {
    const mockOnSubmit = jest.fn();
    render(<ContactUsForm onSubmit={mockOnSubmit} />);

    const element = screen.getByLabelText("Email");
    await testFieldRequiredValidation(element, mockOnSubmit);
    await testFieldWithInvalidData(
      element,
      mockOnSubmit,
      "invalid email",
      FORM_ERROR_MESSAGES.EMAIL
    );
  });

  it("should display error for invalid phone number field", async () => {
    const mockOnSubmit = jest.fn();
    render(<ContactUsForm onSubmit={mockOnSubmit} />);

    const element = screen.getByLabelText("Phone number");
    await testFieldRequiredValidation(element, mockOnSubmit);
    await testFieldWithInvalidData(
      element,
      mockOnSubmit,
      "invalid phone number",
      FORM_ERROR_MESSAGES.PHONE_NUMBER
    );
  });
});
