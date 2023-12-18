import { words } from "lodash";
import millify from "millify";
import moment from "moment";
import { store } from "@/shared/appConfig";
import { CurrencySymbol, PaymentAmount } from "@/shared/models";
import { Currency } from "@/shared/models";
import { BaseProposal } from "@/shared/models/governance/proposals";
import { transformFirebaseDataList } from "@/shared/utils/transformFirebaseDataToModel";
import { BASE_URL } from "../constants";
import { Common, DateFormat, Time, User } from "../models";
import { ElementType } from "../ui-kit/TextEditor/constants";

export const getPrefix = (currency: Currency): string => {
  switch (currency) {
    case Currency.ILS:
      return CurrencySymbol.Shekel;
    case Currency.USD:
      return CurrencySymbol.USD;
    default:
      return "";
  }
};

export const getPostfixForEntrance = (currency: Currency): string => {
  switch (currency) {
    case Currency.ILS:
      return "ILS";
    case Currency.USD:
      return CurrencySymbol.USD;
    default:
      return "";
  }
};

interface FormatPriceOptions {
  shouldMillify?: boolean;
  shouldRemovePrefixFromZero?: boolean;
  bySubscription?: boolean;
  prefix?: string;
  postfix?: string;
}

/**
 * Backend stores the price in cents, that's why we divide by 100
 **/
export const formatPrice = (
  price: Partial<PaymentAmount>,
  options: FormatPriceOptions = {},
): string => {
  const isRtlLanguage = store.getState().shared.isRtlLanguage;
  const {
    shouldMillify = true,
    shouldRemovePrefixFromZero = true,
    bySubscription = false,
    prefix = getPrefix(price?.currency || Currency.ILS),
  } = options;
  const monthlyLabel = isRtlLanguage ? " לחודש" : "/mo";

  if (!price.amount) {
    return shouldRemovePrefixFromZero ? "0" : `${prefix}0`;
  }

  const convertedPrice = price.amount / 100;
  const milifiedPrice = shouldMillify
    ? millify(convertedPrice)
    : convertedPrice.toLocaleString("en-US");

  return `${prefix}${milifiedPrice}${bySubscription ? monthlyLabel : ""}`;
};

export const formatPriceEntrance = (
  price: Partial<PaymentAmount>,
  options: FormatPriceOptions = {},
): string => {
  const {
    shouldMillify = true,
    shouldRemovePrefixFromZero = true,
    bySubscription = false,
    postfix = getPostfixForEntrance(price?.currency || Currency.ILS),
  } = options;

  if (!price.amount) {
    return shouldRemovePrefixFromZero ? "0" : `0${postfix}`;
  }

  const convertedPrice = price.amount / 100;
  const milifiedPrice = shouldMillify
    ? millify(convertedPrice)
    : convertedPrice.toLocaleString("en-US");

  return `${milifiedPrice} ${postfix}${bySubscription ? "/mo" : ""}`;
};

/**
 * Returns the date in a given format. Default is DD-MM-YYYY HH:mm
 * @param {Time} time
 * @param {DateFormat} format the desired format
 */
export const formatEpochTime = (
  time: Time,
  format: DateFormat = DateFormat.Long,
) => {
  return moment.unix(time.seconds).local().format(format);
};

export const getUserName = (
  user?: Pick<User, "firstName" | "lastName" | "displayName"> | null,
): string => {
  if (!user) {
    return "";
  }

  return (
    user.displayName?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  );
};

export const getUserInitials = (user: User | undefined) => {
  if (!user) return "";
  return user.displayName || `${user.firstName[0]}${user.lastName[0]}`;
};

export const getRandomUserAvatarURL = (name?: string | null): string => {
  const isOneWord = words(name ?? "").length === 1;
  return `https://eu.ui-avatars.com/api/?background=de189b&color=fff&name=${name?.replace(
    /\s/gi,
    "+",
  )}&rounded=true&${isOneWord ? "uppercase=false" : ""}`;
};

export const isRandomUserAvatarURL = (url: string): boolean =>
  url.startsWith("https://eu.ui-avatars.com/api");

interface GetDaysAgoOptions {
  withExactTime?: boolean;
}

export const getDaysAgo = (
  currentDate: Date,
  time: Time,
  options: GetDaysAgoOptions = {},
) => {
  const { withExactTime = false } = options;
  const previousDate = new Date(time.seconds * 1000);
  const differenceInTime = currentDate.getTime() - previousDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  let daysAgo: string;

  if (differenceInDays < 1) {
    daysAgo = "Today";
  } else if (differenceInDays < 2) {
    daysAgo = "1 day ago";
  } else {
    daysAgo = `${differenceInDays.toFixed()} days ago`;
  }

  return !withExactTime
    ? daysAgo
    : `${daysAgo}, ${previousDate.getHours()}:${previousDate.getMinutes()}`;
};

/**
 * Checks whether it's a mobile device
 * @returns {boolean}
 */
export const isMobile = (): boolean => {
  return (
    // eslint-disable-next-line
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      navigator.userAgent || navigator.vendor || (window as any).opera,
    ) || // eslint-disable-next-line
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      (navigator.userAgent || navigator.vendor || (window as any).opera).substr(
        0,
        4,
      ),
    )
  );
};

/**
 * Returns true if the given string contains Hebrew
 * @param {string} str
 */
export const containsHebrew = (str: string) => {
  return /[\u0590-\u05FF]/.test(str);
};

export const isRTL = (text = ""): boolean => {
  if (!text) {
    return false;
  }

  const ltrChars =
    "A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF" +
    "\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF";
  const rtlChars = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC";
  const rtlDirCheck = new RegExp("^[^" + ltrChars + "]*[" + rtlChars + "]");

  return Boolean(text && rtlDirCheck.test(text));
};

export const isRtlText = (text = ""): boolean => {
  try {
    const parsedText = JSON.parse(text);
    const textWithNoMentions = JSON.stringify(
      parsedText[0].children?.filter(
        (item) => item.type !== ElementType.Mention,
      ),
    );

    for (let i = 0; i < textWithNoMentions.length; i++) {
      const charCode = textWithNoMentions.charCodeAt(i);

      // Hebrew Block
      if (charCode >= 0x0590 && charCode <= 0x05ff) return true;

      // Arabic Block
      if (charCode >= 0x0600 && charCode <= 0x06ff) return true;

      // Arabic Supplement Block
      if (charCode >= 0x0750 && charCode <= 0x077f) return true;

      // Arabic Extended-A Block
      if (charCode >= 0x08a0 && charCode <= 0x08ff) return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Validate credit card provider (Visa or MasterCard)
 * Currently only Visa is supported.
 * MasterCard RegEx |^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$
 * @param {string | number} ccNumber
 */
export const validateCreditCardProvider = (ccNumber: string | number) => {
  return new RegExp(/^4[0-9]{12}(?:[0-9]{3})?$/).test(String(ccNumber));
};

/**
 * Luhn algorithm to verfiy a credit card number
 * @param {string | number} ccNumber
 */
export const luhnAlgo = (ccNumber: string | number) => {
  let nCheck = 0,
    bEven = false;
  ccNumber = String(ccNumber).replace(/\D/g, "");

  for (let n = ccNumber.length - 1; n >= 0; n--) {
    const cDigit = ccNumber.charAt(n);
    let nDigit = parseInt(cDigit, 10);

    if (bEven) {
      if ((nDigit *= 2) > 9) nDigit -= 9;
    }

    nCheck += nDigit;
    bEven = !bEven;
  }

  return nCheck % 10 === 0;
};

/**
 * Validate a CVV number
 * @param {string | number} cvv
 */
export const validateCVV = (cvv: string | number) => {
  return new RegExp(/^[0-9]{3,4}$/).test(String(cvv));
};

/**
 * Get today date in pattern of yyyy-mm-dd
 * Also used for a <input> type "date"
 * @returns {string} yyyy-mm-dd
 */
export const getTodayDate = () => {
  const today = new Date();
  let dd: number | string = today.getDate();
  let mm: number | string = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return yyyy + "-" + mm + "-" + dd;
};

/**
 * Examples:
 *   value = 10 -> 20 will be returned
 *   value = 24 -> 30 will be returned
 *   value = 36 -> 40 will be returned
 **/
export const roundNumberToNextTenths = (
  value: number,
  valueForRounding = 10,
): number =>
  Math.floor((value + valueForRounding) / valueForRounding) * valueForRounding;

export const getProposalExpirationDate = (proposal: BaseProposal): Date => {
  const timestamp =
    proposal.data.votingExpiresOn || proposal.data.discussionExpiresOn;

  return timestamp ? new Date(timestamp.seconds * 1000) : new Date();
};

/**
 * Allowed {index}: 1 <= index <= 8
 **/
export const getCommonExampleImageURL = (index: number): string =>
  `https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_0${index}.png?alt=media`;

export const getSharingURL = (path: string): string => `${BASE_URL}${path}`;

export const percentage = (
  partialValue: number,
  totalValue: number,
): number => {
  if (totalValue === 0) {
    return 0;
  }

  return Math.round(((100 * partialValue) / totalValue) * 10) / 10;
};

export const formatCountdownValue = (value: number): string => {
  const convertedValue = String(value);

  return convertedValue.length === 1 ? `0${convertedValue}` : convertedValue;
};

export const createIdsChunk = (pool: string[]) =>
  pool.reduce((resultArray: any, item, index) => {
    const chunkIndex = Math.floor(index / 10);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

export function flatChunk<T>(data: unknown[]) {
  return (data as unknown[])
    .map((d: any) => transformFirebaseDataList<T>(d))
    .reduce((resultArray: any, item) => {
      resultArray.push(...item);
      return resultArray;
    }, []);
}

export function groupBy<T>(list: T[], keyGetter: (key: T) => string) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    const y = Math.floor(interval);
    return y + (y > 1 ? " years ago" : " year ago");
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const m = Math.floor(interval);
    return m + (m > 1 ? " months ago" : " month ago");
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const d = Math.floor(interval);
    return d + (d > 1 ? " days ago" : " day ago");
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const h = Math.floor(interval);
    return h + (h > 1 ? " hours ago" : " hour ago");
  }
  interval = seconds / 60;
  if (interval > 1) {
    const min = Math.floor(interval);
    return min + (min > 1 ? " minutes ago" : " minute ago");
  }
  return Math.floor(seconds) + " seconds ago";
}

const getDateValue = (data: Time | Date) => {
  if (!data) return 0;
  if ("toDate" in data) {
    return data?.toDate()?.getTime();
  } else {
    if (data) {
      if ("getTime" in data) {
        return data?.getTime();
      }
    }
  }
  return 0;
};

export function getLastActivity(data: Common) {
  const { discussions, createdAt, proposals, messages } = data;
  const activities = [getDateValue(createdAt)];

  discussions?.forEach((d) => {
    if (d.createdAt) {
      activities.push(getDateValue(d.createdAt));
    }
    if (d.updatedAt) {
      activities.push(getDateValue(d.updatedAt));
    }
  });
  proposals?.forEach((d) => {
    if (d.createdAt) {
      activities.push(getDateValue(d.createdAt));
    }
    if (d.updatedAt) {
      activities.push(getDateValue(d.updatedAt));
    }
  });
  messages?.forEach((d) => {
    activities.push(getDateValue(d.createdAt));
  });

  const lastActivity = Math.max.apply(null, activities);

  return timeSince(new Date(lastActivity));
}

export const sortByCreatedTime = (
  operandA: { createdAt: Time },
  operandB: { createdAt: Time },
): number => {
  if (!operandB.createdAt) return -1;

  if (!operandA.createdAt) return 1;

  return operandB.createdAt.seconds - operandA.createdAt.seconds;
};

export const getMonthsDifference = (startDate: Date, endDate: Date): number =>
  endDate.getMonth() -
  startDate.getMonth() +
  12 * (endDate.getFullYear() - startDate.getFullYear());
