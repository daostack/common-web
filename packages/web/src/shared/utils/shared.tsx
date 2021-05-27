import { User } from '../../graphql';

export const formatPrice = (price?: number) => {
  if (price) return `$${price.toLocaleString("en")}`;
  return "$0";
};

export const getUserName = (user: User | undefined) => {
  if (!user) return "";
  return user.displayName || `${user.firstName} ${user.lastName}`;
};

export const getUserInitials = (user: User | undefined) => {
  if (!user) return "";
  return user.displayName || `${user.firstName?.[0]}${user.lastName?.[0]}`;
};

export const getDaysAgo = (currentDate: Date, time: Date) => {
  const previousDate = new Date(time);
  const differenceInTime = currentDate.getTime() - previousDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  if (differenceInDays < 1) {
    return "Today";
  } else if (differenceInDays < 2) {
    return "1 day ago";
  } else {
    return `${differenceInDays.toFixed()} days ago`;
  }
};
