/**
 * Example usage of the optimized ImageLazy component
 * This file demonstrates all the new features
 */

import React from 'react';
import { ImageLazy } from './src/index';

const ExampleApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>ImageLazy Component Examples</h1>
      
      {/* Basic Usage */}
      <section style={{ marginBottom: '40px' }}>
        <h2>1. Basic Lazy Loading</h2>
        <ImageLazy
          imgUrl="https://picsum.photos/800/600?random=1"
          alt="Basic lazy loading example"
          width={400}
          height={300}
          style={{ borderRadius: '8px' }}
        />
      </section>

      {/* Progressive Loading */}
      <section style={{ marginBottom: '40px' }}>
        <h2>2. Progressive Loading with Blur Effect</h2>
        <ImageLazy
          imgUrl="https://picsum.photos/800/600?random=2"
          alt="Progressive loading example"
          width={400}
          height={300}
          progressive={true}
          progressiveOptions={{
            blurAmount: 15,
            transitionDuration: 800
          }}
          style={{ borderRadius: '8px' }}
        />
      </section>

      {/* Responsive Images */}
      <section style={{ marginBottom: '40px' }}>
        <h2>3. Responsive Images with Optimization</h2>
        <ImageLazy
          imgUrl="https://picsum.photos/1920/1080?random=3"
          alt="Responsive image example"
          responsive={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          optimizationOptions={{
            quality: 85,
            format: 'webp'
          }}
          style={{ 
            width: '100%', 
            maxWidth: '600px',
            height: 'auto',
            borderRadius: '8px'
          }}
        />
      </section>

      {/* Error Handling with Retry */}
      <section style={{ marginBottom: '40px' }}>
        <h2>4. Error Handling with Retry Mechanism</h2>
        <ImageLazy
          imgUrl="https://nonexistent-domain.com/image.jpg"
          imgUrlDefault="https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Fallback+Image"
          alt="Error handling example"
          width={400}
          height={300}
          retryOptions={{
            retryCount: 2,
            retryDelay: 1000,
            timeout: 5000
          }}
          errorComponent={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#666',
              backgroundColor: '#f5f5f5',
              border: '2px dashed #ddd',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '2em' }}>😞</span>
              <span>Failed to load after retries</span>
            </div>
          }
          style={{ borderRadius: '8px' }}
        />
      </section>

      {/* Custom Loading Skeleton */}
      <section style={{ marginBottom: '40px' }}>
        <h2>5. Custom Loading Skeleton</h2>
        <ImageLazy
          imgUrl="https://picsum.photos/800/600?random=4&delay=3000"
          alt="Custom skeleton example"
          width={400}
          height={300}
          showSkeleton={true}
          skeletonColor="#e0e0e0"
          loadingComponent={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#999',
              fontSize: '14px'
            }}>
              <div style={{
                animation: 'spin 1s linear infinite',
                marginRight: '8px'
              }}>
                🔄
              </div>
              Loading high-quality image...
            </div>
          }
          style={{ borderRadius: '8px' }}
        />
      </section>

      {/* Grid of Images */}
      <section style={{ marginBottom: '40px' }}>
        <h2>6. Grid of Optimized Images</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '20px'
        }}>
          {Array.from({ length: 6 }, (_, i) => (
            <ImageLazy
              key={i}
              imgUrl={`https://picsum.photos/400/300?random=${i + 10}`}
              alt={`Grid image ${i + 1}`}
              width="100%"
              height={200}
              progressive={true}
              optimizationOptions={{
                quality: 80,
                format: 'webp'
              }}
              style={{
                borderRadius: '8px',
                objectFit: 'cover'
              }}
              showSkeleton={true}
              skeletonColor="#f0f0f0"
            />
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
};

export default ExampleApp;