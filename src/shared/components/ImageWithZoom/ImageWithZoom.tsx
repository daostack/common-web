import React, { ImgHTMLAttributes } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./ImageWithZoom.module.scss";

const ImageWthZoom = ({
  src,
  alt,
  className,
  ...restProps
}: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <TransformWrapper>
      <TransformComponent
        wrapperClass={styles.imageWithZoomContainer}
        contentClass={styles.imageWithZoomContainer}
      >
        <img src={src} alt={alt} className={className} {...restProps} />
      </TransformComponent>
    </TransformWrapper>
  );
};

export default ImageWthZoom;
