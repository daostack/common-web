import * as Yup from "yup";
import gPhoneNumber from 'google-libphonenumber';

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();

const ISRAEL_COUNTRY_CODE = 'IL';

Yup.addMethod(Yup.string, 'phone', function yupPhone(
  errorMessage = ''
) {
  const errMsg =
    typeof errorMessage === 'string' && errorMessage
      ? errorMessage
      // eslint-disable-next-line no-template-curly-in-string
      : '${path} must be in a valid format.';
  return this.test('phone', errMsg, (value: string) => {
    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(value, ISRAEL_COUNTRY_CODE);

      if (!phoneUtil.isPossibleNumber(phoneNumber)) {
        return false;
      }

      return phoneUtil.isValidNumberForRegion(phoneNumber, ISRAEL_COUNTRY_CODE);
    } catch {
      return false;
    }
  });
});