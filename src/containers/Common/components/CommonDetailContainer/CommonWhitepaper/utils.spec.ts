import { calculateVoters } from "./utils";

describe("calculateVoters", () => {
  it("should calculate voters correctly", () => {
    const circles = ['Member', 'Senior', 'Leader'];
    const weights = [{ value: 100, circles: 1610612736 }];

    expect(calculateVoters(circles, weights)).toEqual(['Senior', 'Leader']);
  });
});
