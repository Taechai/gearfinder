"use client";
import { useState } from "react";

export default function ZoomableIconButton({
  className = "",
  Icon,
  onClick,
}: {
  className: string;
  Icon: ({
    className,
    ...props
  }: {
    [x: string]: any;
    className?: string | undefined;
  }) => JSX.Element;
  onClick?: React.MouseEventHandler;
}) {
  const [shouldScale, setShouldScale] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    setShouldScale(true);
    setTimeout(() => {
      setShouldScale(false);
    }, 100);
    if (onClick) onClick(e);
  };
  return (
    <>
      <Icon
        className={`${className} ${shouldScale ? "scale-75" : ""}`}
        onClick={handleClick}
      />
    </>
  );
}
