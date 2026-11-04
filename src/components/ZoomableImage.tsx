import React, { useCallback, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from './Image';
import { Ids } from '../models/Ids';

interface IZoomableImageProps {
  ids: Ids;
  text: string;
  type: 'movie' | 'show' | 'person';
  size?: 'small' | 'big';
}

export default function ZoomableImage({
  ids,
  text,
  type,
  size = 'small',
}: IZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springScale = useSpring(scale, { stiffness: 300, damping: 30 });
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Touch handling for pinch
  const initialDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY,
      );
      initialDistance.current = dist;
      initialScale.current = scale.get();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance.current !== null) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY,
      );

      const scaleFactor = dist / initialDistance.current!;
      const newScale = Math.min(
        Math.max(initialScale.current * scaleFactor, 1),
        4,
      );

      scale.set(newScale);
      if (newScale > 1) {
        setIsZoomed(true);
      }
    }
  };

  const handleTouchEnd = () => {
    initialDistance.current = null;
    // If scale is too small, reset
    if (scale.get() <= 1) {
      setIsZoomed(false);
      scale.set(1);
      x.set(0);
      y.set(0);
    }
  };

  const handleDoubleTap = () => {
    if (isZoomed) {
      scale.set(1);
      x.set(0);
      y.set(0);
      setIsZoomed(false);
    } else {
      scale.set(2.5);
      setIsZoomed(true);
    }
  };

  return (
    <div
      className="relative overflow-hidden w-full h-full flex justify-center items-center bg-black/5"
      style={{ touchAction: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleTap}
    >
      <motion.div
        style={{
          scale: springScale,
          x: springX,
          y: springY,
        }}
        drag={isZoomed ? true : false}
        dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }} // Rough constraints
        onDragEnd={() => {
          // Optional: snap back if not zoomed enough
        }}
      >
        <Image ids={ids} text={text} type={type} size={size} />
      </motion.div>

      {isZoomed && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-2 py-1 rounded pointer-events-none">
          Pinch to zoom • Drag to pan • Double tap to reset
        </div>
      )}
    </div>
  );
}
