import * as Yup from "yup";
import gPhoneNumber from 'google-libphonenumber';
import { CountryCode } from "@/shared/constants";

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();

Yup.addMethod(Yup.string, 'phone', function yupPhone(
  errorMessage = ''
) {
  const errMsg =
    typeof errorMessage === 'string' && errorMessage
      ? errorMessage
      // eslint-disable-next-line no-template-curly-in-string
      : '${path} must be in a valid format.';
  return this.test('phone', errMsg, (value?: string) => {
    if (typeof value === "undefined") {
      return true;
    }

    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(value, CountryCode.IL);

      if (!phoneUtil.isPossibleNumber(phoneNumber)) {
        return false;
      }

      return phoneUtil.isValidNumberForRegion(phoneNumber, CountryCode.IL);
    } catch {
      return false;
    }
  });
});
