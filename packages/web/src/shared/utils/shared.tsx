import { Time, User } from "../models";

export const formatPrice = (price?: number) => {
  if (price) return `$${price.toLocaleString("en")}`;
  return "$0";
};

export const getUserName = (user: User | undefined) => {
  if (!user) return "";
  return user.displayName || `${user.firstName} ${user.lastName}`;
};

export const getDaysAgo = (currentDate: Date, time: Time) => {
  const previousDate = new Date(time.seconds * 1000);
  const differenceInTime = currentDate.getTime() - previousDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  if (differenceInDays < 1) {
    return "Today";
  } else if (differenceInDays < 1) {
    return "1 day ago";
  } else {
    return `${differenceInDays.toFixed()} days ago`;
  }
};
