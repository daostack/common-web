import React from "react";
import { ScreenSize } from "@/shared/constants";
import { BankAccountDetails, Gender } from "@/shared/models";
import withTestId from "@/shared/utils/tests/withTestId";
import {
  fireEvent,
  mockScreenSize,
  render,
  screen,
  within,
} from "@/shared/utils/tests";
import BankAccount from "./BankAccount";

jest.mock(
  "@/containers/Common/components/CommonDetailContainer/AddProposalComponent/AddBankDetails/AddBankDetails",
  () => {
    const module = jest.requireActual(
      "@/containers/Common/components/CommonDetailContainer/AddProposalComponent/AddBankDetails/AddBankDetails"
    );

    return {
      ...module,
      AddBankDetails: jest.fn(
        withTestId("add-bank-details", module.AddBankDetails)
      ),
    };
  }
);
jest.mock("../AddingCard", () => {
  const module = jest.requireActual("../AddingCard");

  return {
    ...module,
    AddingCard: jest.fn(withTestId("adding-card", module.AddingCard)),
  };
});
jest.mock("../BankAccountInfo", () => {
  const module = jest.requireActual("../BankAccountInfo");

  return {
    ...module,
    BankAccountInfo: jest.fn(
      withTestId("bank-account-info", module.BankAccountInfo)
    ),
  };
});
jest.mock("@/shared/components", () => {
  const module = jest.requireActual("@/shared/components");

  return {
    ...module,
    Modal: jest.fn(
      withTestId("modal", module.Modal, { shouldWrapChildren: true })
    ),
  };
});

describe("BankAccount", () => {
  const bankAccount: BankAccountDetails = {
    bankCode: 123,
    branchNumber: 11111,
    accountNumber: 22222,
    identificationDocs: [],
    city: "City",
    country: "IL",
    streetAddress: "Street Address",
    streetNumber: 33,
    firstName: 'Ignat',
    lastName: 'Petrovich',
    socialId: "123456789",
    socialIdIssueDate: "10/03/2022",
    birthdate: "01/02/1995",
    gender: Gender.Male,
    phoneNumber: "9999999999",
    email: "example@gmail.com",
  };


  beforeEach(() => {
    mockScreenSize(ScreenSize.Desktop);
  });

  it("should allow to add details", () => {
    render(<BankAccount bankAccount={null} onBankAccountChange={() => {}} />);

    expect(screen.getByTestId("adding-card")).toBeInTheDocument();
  });

  it("should open modal to add details", () => {
    render(<BankAccount bankAccount={null} onBankAccountChange={() => {}} />);

    fireEvent.click(screen.getByText(/Add Bank Account/i));

    const modals = screen.getAllByTestId("modal");
    expect(screen.queryByTestId("adding-card")).toBeInTheDocument();
    expect(
      modals.some((modal) => within(modal).queryByTestId("add-bank-details"))
    ).toBeTruthy();
  });

  it("should show details", () => {
    render(
      <BankAccount bankAccount={bankAccount} onBankAccountChange={() => {}} />
    );

    expect(screen.getByTestId("bank-account-info")).toBeInTheDocument();
  });

  it("should open modal to edit bank details", () => {
    render(
      <BankAccount bankAccount={bankAccount} onBankAccountChange={() => {}} />
    );

    fireEvent.click(screen.getByText(/Edit Details/i));

    const modals = screen.getAllByTestId("modal");
    expect(screen.queryByTestId("bank-account-info")).toBeInTheDocument();
    expect(
      modals.some((modal) => within(modal).queryByTestId("add-bank-details"))
    ).toBeTruthy();
  });

  describe("for mobile view", () => {
    beforeEach(() => {
      mockScreenSize(ScreenSize.Mobile);
    });

    it("should allow to add details", () => {
      render(<BankAccount bankAccount={null} onBankAccountChange={() => {}} />);

      fireEvent.click(screen.getByText(/Add Bank Account/i));

      const modals = screen.queryAllByTestId("modal");
      expect(screen.queryByTestId("adding-card")).not.toBeInTheDocument();
      expect(
        modals &&
          modals.every(
            (modal) => !within(modal).queryByTestId("add-bank-details")
          )
      ).toBeTruthy();
    });
  });
});
