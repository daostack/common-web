import React, {
  useCallback,
  useState,
  FC,
  ImgHTMLAttributes,
  ReactNode,
  ReactEventHandler,
} from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  placeholderElement?: ReactNode;
}

const Image: FC<ImageProps> = (props) => {
  const { alt, onError, placeholderElement = null, ...restProps } = props;
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
    <img {...restProps} alt={alt} onError={handleError} />
  );
};

export default Image;
