import { ITEM_WIDTH, MINIMAL_SLIDES_SPACE_BETWEEN } from "./constants";

interface SwiperConfig {
  slidesPerView: number;
  spaceBetween: number;
  scrollable: boolean;
}

export const getSwiperConfig = (itemsAmount: number, containerWidth: number): SwiperConfig => {
  if ([0, 1].includes(itemsAmount) || !containerWidth) {
    return {
      slidesPerView: 1,
      spaceBetween: 0,
      scrollable: false,
    };
  }

  const basicSlidePerView =
    (containerWidth + MINIMAL_SLIDES_SPACE_BETWEEN) /
    (ITEM_WIDTH + MINIMAL_SLIDES_SPACE_BETWEEN);

  if (
    itemsAmount * ITEM_WIDTH +
    (itemsAmount - 1) * MINIMAL_SLIDES_SPACE_BETWEEN <=
    containerWidth
  ) {
    return {
      slidesPerView: basicSlidePerView,
      spaceBetween: MINIMAL_SLIDES_SPACE_BETWEEN,
      scrollable: false,
    };
  }

  const slidesPerView = Math.floor(basicSlidePerView);

  return {
    slidesPerView,
    spaceBetween:
      (containerWidth - slidesPerView * ITEM_WIDTH) / (slidesPerView - 1),
    scrollable: true,
  };
};
