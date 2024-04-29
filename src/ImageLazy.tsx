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
  width?: any;
  height?: any;
  radiusBorder?: number;
  className?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
  onKeyDown?: KeyboardEventHandler<HTMLImageElement>;
  onKeyPress?: () => void;
  style?: CSSProperties;
  alt?: any;
  id?: string;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  loading?: "lazy" | "eager";
  isLoading?: boolean;
};

const ImageLazy = React.memo(function ImageLazy({
  alt,
  radiusBorder,
  onClick,
  style,
  height,
  onKeyPress,
  onKeyDown,
  id,
  crossOrigin,
  loading,
  imgUrl,
  width,
  className,
  isLoading,
}: ImageLazyProps) {
  // check if image url work or not , it work  return true, else return false;
  const isUrl = useImageBroken(imgUrl);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  function validURL(str: string) {
    let regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
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
  }, [])


  if (isLoading || !isUrl  || !shouldLoad) {
    return (
      <picture>
        <source
          data-srcset={`https://i.imgur.com/9u7kJQK.png`}
          srcSet={`https://i.imgur.com/9u7kJQK.png`}
          type="image/png"
        />
        <img
          ref={imgRef}

          src={`https://i.imgur.com/9u7kJQK.png`}
          alt={alt}
          data-src={`https://i.imgur.com/9u7kJQK.png`}
          loading={loading}
          crossOrigin={crossOrigin}
          onClick={onClick}
          style={style}
          width={width}
          height={height}
          onKeyDown={onKeyDown}
          

          id={id}
          className={`${className} lazyload`}
        />
      </picture>
    );
  }
  return (
    <>
      <picture key={isUrlValid}>
        <source
          data-srcset={isUrl ? isUrlValid : `https://i.imgur.com/9u7kJQK.png`}
          srcSet={isUrl ? isUrlValid : `https://i.imgur.com/9u7kJQK.png`}
          type="image/webp"
        />
        <img
        key={isUrlValid}
          src={isUrl ? isUrlValid : `https://i.imgur.com/9u7kJQK.png`}
          alt={alt}
          ref={imgRef}

          data-src={isUrl ? isUrlValid : `https://i.imgur.com/9u7kJQK.png`}
          loading={loading}
          crossOrigin={crossOrigin}
          onClick={onClick}
          style={style}
          width={"100%"}
          height={"100%"}

          id={id}
          className={`${className} lazyload`}
        />
      </picture>
    </>
  );
});

export default ImageLazy;