/*
 *   Copyright (c) 2023 Phuong My Chi Entertainment Co.,Ltd
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

/* 
hook để kiểm tra hình ảnh bị lỗi đường dẫn
Optimized version with proper cleanup and memory management
*/

import { useEffect, useState, useCallback, useRef } from "react";

export interface UseImageBrokenOptions {
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

const useImageBroken = (url: string, options: UseImageBrokenOptions = {}) => {
  const { timeout = 10000, retryCount = 2, retryDelay = 1000 } = options;
  const [isHaveImg, setImg] = useState<boolean | null>(null); // null = loading, true = success, false = error
  const [retries, setRetries] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
      imgRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const attemptLoad = useCallback((imageUrl: string, attempt: number = 0) => {
    if (!imageUrl) {
      setImg(false);
      return;
    }

    setImg(null); // Set loading state
    cleanup();

    const img = new Image();
    imgRef.current = img;

    // Set timeout for image loading
    timeoutRef.current = setTimeout(() => {
      if (attempt < retryCount) {
        setTimeout(() => attemptLoad(imageUrl, attempt + 1), retryDelay);
        setRetries(attempt + 1);
      } else {
        setImg(false);
        cleanup();
      }
    }, timeout);

    img.onload = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setImg(true);
      setRetries(0);
    };

    img.onerror = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (attempt < retryCount) {
        setTimeout(() => attemptLoad(imageUrl, attempt + 1), retryDelay);
        setRetries(attempt + 1);
      } else {
        setImg(false);
        setRetries(0);
      }
    };

    img.src = imageUrl;
  }, [timeout, retryCount, retryDelay, cleanup]);

  useEffect(() => {
    if (url) {
      attemptLoad(url);
    } else {
      setImg(false);
    }

    return cleanup;
  }, [url, attemptLoad, cleanup]);

  return {
    isValid: isHaveImg,
    isLoading: isHaveImg === null,
    retries
  };
};

export default useImageBroken;