export const formatPrice = (price?: number) => {
  if (price) return `$${price.toLocaleString("en")}`;
  return "$0";
};
