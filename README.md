# A React node module for lazy loading images.

## Getting started :

1.  npm i image-lazy-component

```tsx
import React from "react";
import { ImageLazy } from "image-lazy-component"

const YourComponent = () => {
  return (
    <ImageLazy
      alt="Alt text for the image"
      radiusBorder={5}
      onClick={() => console.log("Image clicked")}
      style={{ width: "200px", height: "auto" }}
      height={200}
      onKeyPress={() => console.log("Key pressed")}
      onKeyDown={() => console.log("Key down")}
      id="your-image-id"
      crossOrigin="anonymous"
      loading="lazy"
      imgUrl="https://example.com/your-image.jpg"
      width={300}
      className="custom-image-class"
      isLoading={false}
    />
  );
};

export default YourComponent;
```
## Props :

`alt`: Placeholder text displayed when the image fails to load.

`radiusBorder`: The border radius of the image.

`onClick`: Event handler function triggered when clicking on the image.

`style`: Inline CSS for the image.

`height`: Height of the image.

`onKeyPress`: Event handler function triggered when a key is pressed while the image is focused.

`onKeyDown`: Event handler function triggered when a key is pressed while the image is focused.

`id`: ID of the image.

`crossOrigin`: Cross-origin attribute of the image.

`loading`: Loading mode of the image (lazy or eager).

`imgUrl`: URL of the image.

`width`: Width of the image.

`className`: Custom CSS class of the image.

`isLoading`: Loading state of the image.

(c) 2023 Phuong My Chi  Entertainment Co.,Ltd

 Licensed under the MIT License