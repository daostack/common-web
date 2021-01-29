// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { addMonth } from '@functions/util/addMonth';

describe('The utils', () => {
  describe('The addMonth method', () => {
    it('should work with normal dates', () => {
      // Arrange
      const dateOne = new Date(2020, 3, 12);
      const dateOneAfterMonth = new Date(2020, 4, 12);

      const dateTwo = new Date(2020, 4, 15);
      const dateTwoAfterMonth = new Date(2020, 5, 15);

      // Act
      const resOne = addMonth(dateOne);
      const resTwo = addMonth(dateTwo);

      // Assert
      expect(resOne).toEqual(dateOneAfterMonth);
      expect(resTwo).toEqual(dateTwoAfterMonth);
    });

    it('should work with edge case dates', () => {
      // Arrange
      const dateOne = new Date(2019, 0, 30);
      const dateOneAfterMonth = new Date(2019, 1, 28);

      const dateTwo = new Date(2019, 4, 31);
      const dateTwoAfterMonth = new Date(2019, 5, 30);

      // Act
      const resOne = addMonth(dateOne);
      const resTwo = addMonth(dateTwo);

      // Assert
      expect(resOne).toEqual(dateOneAfterMonth);
      expect(resTwo).toEqual(dateTwoAfterMonth);
    })
  });
});