import React, { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; 
  size?: "sss" | "ssm" | "ssmm" | "smm" | "sm" | "md" | "normal"; 
  variant?: "primary" | "outline" | "outlineWarning" | "danger" | "warning" | "success" | "secondary" | "ghost" | "link" | "gradient" | "soft" | "dark" | "normal"; 
  startIcon?: ReactNode; 
  endIcon?: ReactNode; 
  isLoading?: boolean;
  icon?: ReactNode; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
  type = "button",
  ...rest
}) => {
  // Filter out any non-standard button attributes that React doesn't recognize
  const { loading, ...safeRest } = rest as any;
  // Size Classes
  const sizeClasses = {
    sss: "px-4 py-1 text-sm",
    ssm: "px-4 py-2 text-sm",
    ssmm: "px-4 py-2.25 text-sm",
    smm: "px-4 py-2.5 text-sm",
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
    normal: "",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    outlineWarning:
      "inline-flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 font-medium text-orange-700 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30",
    danger:
      "bg-red-600 text-white shadow-theme-xs hover:bg-red-700 disabled:bg-red-300",
    warning:
      "bg-yellow-500 text-white shadow-theme-xs hover:bg-yellow-600 disabled:bg-yellow-300",
    success:
      "bg-green-600 text-white shadow-theme-xs hover:bg-green-700 disabled:bg-green-300",
    secondary:
      "bg-gray-600 text-white shadow-theme-xs hover:bg-gray-700 disabled:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
    link:
      "bg-transparent text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400 dark:hover:text-brand-300",
    gradient:
      "bg-gradient-to-r from-brand-500 to-purple-600 text-white shadow-theme-xs hover:from-brand-600 hover:to-purple-700 disabled:from-brand-300 disabled:to-purple-300",
    soft:
      "bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:bg-brand-25 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/30",
    dark:
      "bg-gray-900 text-white shadow-theme-xs hover:bg-gray-800 disabled:bg-gray-400 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
    normal: 
      ""
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        isDisabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={isDisabled}
      {...safeRest}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;