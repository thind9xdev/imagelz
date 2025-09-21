# ImageLazy - Advanced React Image Component

A powerful React component for lazy loading images with advanced image processing features, progressive loading, and optimization capabilities.

## 🚀 Features

- **Lazy Loading**: Efficient lazy loading with Intersection Observer
- **Progressive Loading**: Blur-to-sharp loading effect for better UX
- **Image Optimization**: Automatic image optimization and format conversion
- **Responsive Images**: Support for responsive images with srcset
- **Error Handling**: Smart retry mechanism for failed image loads
- **TypeScript Support**: Full TypeScript support with comprehensive types
- **Accessibility**: Built-in accessibility features
- **Memory Efficient**: Optimized memory usage and cleanup
- **Customizable**: Highly customizable with extensive props

## 📦 Installation

```bash
npm install image-lazy-component
```

## 🔧 Basic Usage

```tsx
import React from "react";
import { ImageLazy } from "image-lazy-component";

const BasicExample = () => {
  return (
    <ImageLazy
      imgUrl="https://example.com/image.jpg"
      alt="Example image"
      width={400}
      height={300}
    />
  );
};
```

## 🎨 Advanced Usage

### Progressive Loading with Blur Effect

```tsx
import { ImageLazy } from "image-lazy-component";

const ProgressiveExample = () => {
  return (
    <ImageLazy
      imgUrl="https://example.com/high-quality.jpg"
      alt="Progressive loading example"
      progressive={true}
      progressiveOptions={{
        blurAmount: 15,
        transitionDuration: 500
      }}
      width={600}
      height={400}
    />
  );
};
```

### Responsive Images

```tsx
import { ImageLazy } from "image-lazy-component";

const ResponsiveExample = () => {
  return (
    <ImageLazy
      imgUrl="https://example.com/image.jpg"
      alt="Responsive image"
      responsive={true}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      optimizationOptions={{
        quality: 85,
        format: 'webp'
      }}
      width="100%"
      height="auto"
    />
  );
};
```

### With Error Handling and Retry

```tsx
import { ImageLazy } from "image-lazy-component";

const RetryExample = () => {
  return (
    <ImageLazy
      imgUrl="https://example.com/might-fail.jpg"
      imgUrlDefault="https://placehold.co/400x300"
      alt="Image with retry"
      retryOptions={{
        retryCount: 3,
        retryDelay: 2000,
        timeout: 10000
      }}
      errorComponent={
        <div>😞 Failed to load after retries</div>
      }
      loadingComponent={
        <div>🔄 Loading...</div>
      }
    />
  );
};
```

### Custom Skeleton Loading

```tsx
import { ImageLazy } from "image-lazy-component";

const SkeletonExample = () => {
  return (
    <ImageLazy
      imgUrl="https://example.com/image.jpg"
      alt="Custom skeleton"
      showSkeleton={true}
      skeletonColor="#e0e0e0"
      loadingComponent={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%' 
        }}>
          Loading...
        </div>
      }
    />
  );
};
```

## 📚 Props Reference

### Basic Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imgUrl` | `string` | - | **Required**. Main image URL |
| `imgUrlDefault` | `string` | `"https://placehold.co/280x200"` | Fallback image URL |
| `alt` | `string` | `""` | Alternative text for accessibility |
| `width` | `string \| number` | - | Image width |
| `height` | `string \| number` | - | Image height |
| `className` | `string` | `""` | CSS class name |
| `style` | `CSSProperties` | `{}` | Inline styles |
| `loading` | `"lazy" \| "eager"` | `"lazy"` | Loading behavior |

### Advanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progressive` | `boolean` | `false` | Enable progressive loading |
| `progressiveOptions` | `UseProgressiveImageOptions` | `{}` | Progressive loading options |
| `responsive` | `boolean` | `false` | Enable responsive images |
| `sizes` | `string` | `"(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"` | Sizes attribute for responsive images |
| `optimizationOptions` | `ImageOptimizationOptions` | `{}` | Image optimization settings |
| `retryOptions` | `UseImageBrokenOptions` | `{}` | Retry configuration |
| `showSkeleton` | `boolean` | `true` | Show loading skeleton |
| `skeletonColor` | `string` | `"#f0f0f0"` | Skeleton background color |

### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onClick` | `MouseEventHandler<HTMLImageElement>` | Click event handler |
| `onLoad` | `MouseEventHandler<HTMLImageElement>` | Load event handler |
| `onError` | `MouseEventHandler<HTMLImageElement>` | Error event handler |
| `onMouseEnter` | `MouseEventHandler<HTMLImageElement>` | Mouse enter handler |
| `onMouseLeave` | `MouseEventHandler<HTMLImageElement>` | Mouse leave handler |

### Custom Components

| Prop | Type | Description |
|------|------|-------------|
| `loadingComponent` | `React.ReactNode` | Custom loading indicator |
| `errorComponent` | `React.ReactNode` | Custom error display |

## 🔧 Utility Functions

The package also exports utility functions for advanced image processing:

```tsx
import { 
  optimizeImageUrl, 
  generateSrcSet, 
  isValidImageUrl,
  ensureHttps 
} from "image-lazy-component";

// Optimize image URL
const optimized = optimizeImageUrl("https://example.com/image.jpg", {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp'
});

// Generate responsive srcset
const srcSet = generateSrcSet("https://example.com/image.jpg", {
  quality: 80
});

// Validate image URL
const isValid = isValidImageUrl("https://example.com/image.jpg");
```

## 🎯 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import { ImageLazy, ImageLazyProps } from "image-lazy-component";

const TypedComponent: React.FC<ImageLazyProps> = (props) => {
  return <ImageLazy {...props} />;
};
```

## 🔍 Browser Support

- Modern browsers with Intersection Observer support
- Fallback handling for older browsers
- Supports WebP, AVIF format detection
- Progressive enhancement approach

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or issues, please open an issue on [GitHub](https://github.com/thind9xdev/imagelz/issues).

---

Made with ❤️ by [thind9xdev](https://github.com/thind9xdev)