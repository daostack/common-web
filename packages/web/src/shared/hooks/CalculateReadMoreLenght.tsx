function useCalculateReadMoreLength() {
  let length = 0;
  const windowWidth = window.innerWidth;

  if (windowWidth >= 1240 && windowWidth <= 1366) {
    length = 400;
  } else if (windowWidth >= 1366 && windowWidth <= 1680) {
    length = 620;
  } else {
    length = 760;
  }

  return length;
}
export default useCalculateReadMoreLength;
