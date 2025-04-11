"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/libs/utils";

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  min?: number;
  max?: number;
  step?: number;
}

const Slider: React.FC<SliderProps> = ({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  ...props
}) => {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      className={cn(
        "relative flex w-full items-center select-none touch-none",
        "data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      {/* Track */}
      <SliderPrimitive.Track
        className={cn(
          "relative w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full"
        )}
      >
        {/* Active Range */}
        <SliderPrimitive.Range
          className="absolute h-full bg-blue-500 dark:bg-blue-400 rounded-full"
        />
      </SliderPrimitive.Track>

      {/* Thumbs */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn(
            "block w-5 h-5 bg-white dark:bg-gray-200 border-2 border-blue-500 dark:border-blue-400",
            "rounded-full shadow-md transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
};

export { Slider };
