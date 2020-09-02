import functions from "firebase-functions-test";
import * as admin from "firebase-admin";

const testEnv = functions();

const mockSet = jest.fn();

mockSet.mockReturnValue(true);

jest.mock("firebase-admin", () => ({
  initializeApp: jest.fn(),
  database: () => ({
    ref: jest.fn(path => ({
      set: mockSet
    }))
  })
}));

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});
