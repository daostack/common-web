import { checkIsURL } from "./checkIsURL";

// describe("checkIsURL", () => {
//   it("should be truthy for correct urls", () => {
//     expect(checkIsURL("http://common.io")).toBeTruthy();
//     expect(checkIsURL("https://common.io")).toBeTruthy();
//     expect(checkIsURL("http://www.common.io")).toBeTruthy();
//     expect(checkIsURL("https://www.common.io")).toBeTruthy();
//     expect(checkIsURL("www.common.io")).toBeTruthy();
//   });

//   it("should be falsy for incorrect urls", () => {
//     expect(checkIsURL("https:/common.io")).toBeFalsy();
//     expect(checkIsURL("common.io")).toBeFalsy();
//     expect(checkIsURL("Some text")).toBeFalsy();
//     expect(checkIsURL("Some text with link: https://common.io")).toBeFalsy();
//   });
// });
