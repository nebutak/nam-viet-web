"use client";

import React, { useState, useRef, ReactNode } from "react";

interface TooltipProviderProps {
  children: ReactNode;
}

interface TooltipProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface TooltipTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

interface TooltipContentProps {
  children: ReactNode;
  className?: string;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export const Tooltip: React.FC<TooltipProps> = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => handleOpenChange(true)}
      onMouseLeave={() => handleOpenChange(false)}
      className="relative inline-block"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === TooltipTrigger) {
            return React.cloneElement(child as React.ReactElement<any>);
          } else if (child.type === TooltipContent) {
            return isOpen ? child : null;
          }
        }
        return child;
      })}
    </div>
  );
};

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  asChild = false,
  children,
}) => {
  if (asChild && React.isValidElement(children)) {
    return children;
  }
  return <>{children}</>;
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-[9999] min-w-[280px] sm:min-w-[320px] ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};
