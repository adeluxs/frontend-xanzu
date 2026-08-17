"use client";

import {
  isRemoteMediaSource,
  normalizeMediaSource,
} from "@/utils/media";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const SafeImage = ({ src, fallbackSrc = null, alt = "", unoptimized, ...props }) => {
  const primarySource = useMemo(() => normalizeMediaSource(src), [src]);
  const fallbackSource = useMemo(
    () => normalizeMediaSource(fallbackSrc),
    [fallbackSrc],
  );
  const [currentSource, setCurrentSource] = useState(
    primarySource || fallbackSource,
  );

  useEffect(() => {
    setCurrentSource(primarySource || fallbackSource);
  }, [primarySource, fallbackSource]);

  if (!currentSource) return null;

  return (
    <Image
      {...props}
      src={currentSource}
      alt={alt}
      unoptimized={
        unoptimized === undefined
          ? isRemoteMediaSource(currentSource)
          : unoptimized
      }
      onError={() => {
        if (fallbackSource && currentSource !== fallbackSource) {
          setCurrentSource(fallbackSource);
          return;
        }

        setCurrentSource(null);
      }}
    />
  );
};

export default SafeImage;
