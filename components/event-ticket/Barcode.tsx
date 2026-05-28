import React, { useMemo } from 'react';

interface BarcodeProps {
  width: number;
  height: number;
  color?: string;
}

/** Cosmetic barcode generated procedurally — not scannable. */
export const Barcode: React.FC<BarcodeProps> = ({
  width,
  height,
  color = '#131311',
}) => {
  const bars = useMemo(() => {
    const widths = [1, 1, 2, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 2, 2, 1];
    const out: Array<{ x: number; w: number }> = [];
    let x = 0;
    let i = 0;
    while (x < width) {
      const w = widths[i % widths.length];
      const gap = i % 3 === 0 ? 2 : 1;
      out.push({ x, w });
      x += w + gap;
      i++;
    }
    return out;
  }, [width]);

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill={color} />
      ))}
    </svg>
  );
};
