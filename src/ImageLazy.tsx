// This is component Image with Lazy load
import React, {
  CSSProperties,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import "lazysizes";
// import a plugin
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import useImageBroken from "./hooks/useImageBroken";

export type ImageLazyProps = {
  imgUrl: string;
  imgUrlDefault?: string | "https://placehold.co/280x200";
  width?: string | number;
  height?: string | number;
  radiusBorder?: number;
  className?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
  onKeyDown?: KeyboardEventHandler<HTMLImageElement>;
  onMouseDown?: MouseEventHandler<HTMLImageElement>;
  onMouseEnter?: MouseEventHandler<HTMLImageElement>;
  onMouseLeave?: MouseEventHandler<HTMLImageElement>;
  onMouseUp?: MouseEventHandler<HTMLImageElement>;

  onKeyPress?: () => void;
  style?: CSSProperties;
  alt?: string;
  id?: string;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  loading?: "lazy" | "eager";
  isLoading?: boolean;
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "unsafe-url";
};

const ImageLazy = React.memo(function ImageLazy({
  alt,
  onClick,
  style,
  height,
  onKeyDown,
  id,
  crossOrigin,
  loading,
  imgUrl,
  imgUrlDefault,
  width,
  className,
  isLoading,
  referrerPolicy,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
}: ImageLazyProps) {
  // check if image url work or not , it work  return true, else return false;
  const isUrl = useImageBroken(imgUrl);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  function validURL(str: string) {
    let regex =
      /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
      return false;
    } else {
      return true;
    }
  }
  const getHttps = () => {
    const isvalidUrl = validURL(imgUrl);
    if (isvalidUrl) {
      return imgUrl?.replace("http://", "https://");
    } else {
      return imgUrl;
    }
  };
  const isUrlValid = getHttps();

  // eslint-disable-next-line consistent-return

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          if (imgRef.current) {
            observer.unobserve(imgRef.current);
          }
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  if (isLoading || !isUrl || !shouldLoad) {
    return (
      <picture>
        <source
          data-srcset={imgUrlDefault}
          srcSet={imgUrlDefault}
          type="image/png"
        />
        <img
          ref={imgRef}
          src={imgUrlDefault}
          alt={alt}
          data-src={imgUrlDefault}
          loading={loading}
          crossOrigin={crossOrigin}
          onClick={onClick}
          style={style}
          width={width}
          height={height}
          onKeyDown={onKeyDown}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          id={id}
          referrerPolicy={referrerPolicy}
          className={`${className} lazyload`}
        />
      </picture>
    );
  }
  return (
    <>
      <picture key={isUrlValid}>
        <source
          data-srcset={isUrl ? isUrlValid : imgUrlDefault}
          srcSet={isUrl ? isUrlValid : imgUrlDefault}
          type="image/webp"
        />
        <img
          key={isUrlValid}
          src={isUrl ? isUrlValid : imgUrlDefault}
          alt={alt}
          ref={imgRef}
          data-src={isUrl ? isUrlValid : imgUrlDefault}
          loading={loading}
          crossOrigin={crossOrigin}
          onClick={onClick}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          style={style}
          width={width}
          height={width}
          id={id}
          referrerPolicy={referrerPolicy}
          className={`${className} lazyload`}
        />
      </picture>
    </>
  );
});

export default ImageLazy;
