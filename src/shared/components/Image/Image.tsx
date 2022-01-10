import React, {
  useCallback,
  useState,
  FC,
  ImgHTMLAttributes,
  ReactNode,
  ReactEventHandler,
} from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  placeholderElement?: ReactNode;
}

const Image: FC<ImageProps> = (props) => {
  const { onError, placeholderElement = null, ...restProps } = props;
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback<ReactEventHandler<HTMLImageElement>>(
    (...args) => {
      setHasError(true);

      if (onError) {
        onError(...args);
      }
    },
    [onError]
  );

  return hasError && placeholderElement ? (
    <>{placeholderElement}</>
  ) : (
    <img {...restProps} onError={handleError} />
  );
};

export default Image;
