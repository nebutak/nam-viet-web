import React from "react";

interface PendingBubbleProps {
  text?: string;
  icon?: string;
  className?: string;
  type?: "pending" | "payment"; // pending (chờ duyệt) hoặc payment (chờ thanh toán)
}

export default function PendingBubble({
  text = "⚠️ Chờ duyệt",
  icon,
  className = "",
  type = "pending",
}: PendingBubbleProps) {
  const colorConfig = {
    pending: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "border-yellow-300 dark:border-yellow-700",
      text: "text-yellow-800 dark:text-yellow-300",
    },
    payment: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      border: "border-orange-300 dark:border-orange-700",
      text: "text-orange-800 dark:text-orange-300",
    },
  };

  const config = colorConfig[type];

  return (
    <div className={`relative inline-block ml-9 mt-1 ${className}`}>
      <div className={`${config.bg} ${config.border} border rounded px-2 py-1 text-xs font-medium ${config.text} whitespace-nowrap`}>
        {icon || text}
        <div className={`absolute -bottom-0.5 left-2 h-1.5 w-1.5 ${config.bg} ${config.border} border rotate-45`}></div>
      </div>
    </div>
  );
}
