import React, {
  useCallback,
  useEffect,
  useState,
  FC,
  ImgHTMLAttributes,
  ReactNode,
  ReactEventHandler,
} from "react";
import classNames from "classnames";
import { ImageWithZoom } from "../ImageWithZoom";
import styles from "./Image.module.scss";

interface CustomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  preloaderSrc?: string;
  placeholderElement?: ReactNode;
  imageOverlayClassName?: string;
  imageContainerClassName?: string;
  hasZoom?: boolean;
}

const CustomImage: FC<CustomImageProps> = (props) => {
  const {
    src,
    alt,
    preloaderSrc,
    onError,
    placeholderElement,
    imageOverlayClassName,
    imageContainerClassName,
    onClick,
    hasZoom = false,
    ...restProps
  } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageSrc = isLoaded || !preloaderSrc ? src : preloaderSrc;

  const handleError = useCallback<ReactEventHandler<HTMLImageElement>>(
    (...args) => {
      setHasError(true);

      if (onError) {
        onError(...args);
      }
    },
    [onError],
  );

  useEffect(() => {
    if (!src) {
      return;
    }

    setIsLoaded(false);
    setHasError(false);

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const image = new Image();
    image.src = src;
    image.addEventListener("load", handleLoad);

    return () => {
      image.removeEventListener("load", handleLoad);
      setIsLoaded(false);
    };
  }, [src]);

  return hasError && (placeholderElement || placeholderElement === null) ? (
    <>{placeholderElement}</>
  ) : (
    <>
      {hasZoom ? (
        <ImageWithZoom
          {...restProps}
          src={imageSrc}
          alt={alt}
          onError={handleError}
        />
      ) : (
        <div
          onClick={onClick}
          className={classNames(styles.imageContainer, imageContainerClassName)}
        >
          <img {...restProps} src={imageSrc} alt={alt} onError={handleError} />
          <div className={imageOverlayClassName} />
        </div>
      )}
    </>
  );
};

export default CustomImage;
