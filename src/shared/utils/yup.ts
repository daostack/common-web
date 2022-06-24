import * as Yup from "yup";
import gPhoneNumber from 'google-libphonenumber';

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();

Yup.addMethod(Yup.string, 'phone', function yupPhone(
  countryCode?: string,
  errorMessage = ''
) {
  const errMsg =
    typeof errorMessage === 'string' && errorMessage
      ? errorMessage
      // eslint-disable-next-line no-template-curly-in-string
      : '${path} must be a valid phone number.';
  return this.test('phone', errMsg, (value: string) => {
    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(value, countryCode);

      if (!phoneUtil.isPossibleNumber(phoneNumber)) {
        return false;
      }

      return phoneUtil.isValidNumberForRegion(phoneNumber, countryCode);
    } catch {
      return false;
    }
  });
});