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
*/

import { useEffect, useState } from "react";
const useImageBroken = (url: string) => {
  const [isHaveImg, setImg] = useState(true);
  useEffect(() => {
    /* Creating an image element and casting it to HTMLImageElement. */
    const s = document.createElement("IMG") as HTMLImageElement;
    s.src = url;
    // eslint-disable-next-line func-names
    s.onerror = function () {
      setImg(false);
    };
    // eslint-disable-next-line func-names
    s.onload = function () {
      setImg(true);
    };
  }, [url]);

  return isHaveImg;
};

export default useImageBroken;
