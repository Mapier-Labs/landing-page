"use client";

import type { CSSProperties, ReactNode } from "react";

interface DraggableProps {
  className?: string;
  initRotate: number | string;
  style?: CSSProperties;
  children: ReactNode;
}

export function Draggable({ className = "", initRotate, style, children }: DraggableProps) {
  return (
    <div
      className={`draggable ${className}`.trim()}
      data-init-rotate={String(initRotate)}
      style={style}
    >
      {children}
    </div>
  );
}
