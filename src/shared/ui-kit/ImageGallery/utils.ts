const getYouTubeVideoIdFromUrl = (value: string) => {
  const youTubeUrlRegEx =
    "^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)";
  const matches = value.match(youTubeUrlRegEx);
  if (matches) {
    return matches[1];
  }
  return "";
};

export const isYouTubeUrl = (value: string | undefined) => {
  if (!value) return false;
  const youTubeRegExp = new RegExp(
    "^(https?://)?(www.youtube.com|youtu.be)/.+$",
  );
  return youTubeRegExp.test(value);
};

export const formatVideoSource = (value: string) => {
  if (!value) return;
  if (isYouTubeUrl(value)) {
    return `https://www.youtube.com/embed/${getYouTubeVideoIdFromUrl(value)}`;
  }
  return value;
};
