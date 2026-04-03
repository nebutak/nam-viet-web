import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  className?: string;
  label?: string;
}

export default function Divider({
  orientation = "horizontal",
  className,
  label,
  ...props
}: DividerProps) {
  if (label) {
    return (
      <div
        className={cn(
          "flex items-center w-full my-4",
          orientation === "vertical" ? "flex-col h-full mx-4 my-0" : "",
          className
        )}
        {...props}
      >
        <div className={cn(
          "flex-grow bg-gray-200 dark:bg-gray-700",
          orientation === "horizontal" ? "h-[1px]" : "w-[1px] h-full"
        )} />
        
        <span className={cn(
          "text-xs font-medium text-gray-500",
          orientation === "horizontal" ? "px-3" : "py-3"
        )}>
          {label}
        </span>
        
        <div className={cn(
          "flex-grow bg-gray-200 dark:bg-gray-700",
          orientation === "horizontal" ? "h-[1px]" : "w-[1px] h-full"
        )} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700",
        orientation === "horizontal" ? "h-[1px] w-full my-1" : "h-full w-[1px] mx-1",
        className
      )}
      {...props}
    />
  );
}
