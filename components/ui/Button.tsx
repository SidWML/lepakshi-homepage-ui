"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ============================================
// BUTTON VARIANTS
// ============================================

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gold" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  animated?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#1a1a1a] text-white hover:bg-[#333] disabled:bg-[#e5e5e5] disabled:text-[#999]",
  secondary: "bg-white text-[#1a1a1a] border border-[#e5e5e5] hover:border-[#1a1a1a] disabled:bg-[#f5f5f5] disabled:text-[#999]",
  outline: "bg-transparent border-2 border-[#c9a227] text-[#c9a227] hover:bg-[#c9a227] hover:text-white disabled:border-[#e5e5e5] disabled:text-[#999]",
  ghost: "bg-transparent text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:text-[#ccc]",
  gold: "bg-[#c9a227] text-white hover:bg-[#b8922a] disabled:bg-[#e5e5e5] disabled:text-[#999]",
  danger: "bg-[#d32f2f] text-white hover:bg-[#b71c1c] disabled:bg-[#e5e5e5] disabled:text-[#999]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
  xl: "px-10 py-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = "right",
      href,
      animated = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium tracking-wider
      transition-all duration-200
      disabled:cursor-not-allowed
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `.trim();

    const content = (
      <>
        {loading && (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {icon && iconPosition === "left" && !loading && icon}
        {children}
        {icon && iconPosition === "right" && !loading && icon}
      </>
    );

    if (href && !disabled) {
      return (
        <Link href={href} className={baseStyles}>
          {content}
        </Link>
      );
    }

    if (animated) {
      return (
        <motion.button
          ref={ref}
          className={baseStyles}
          disabled={disabled || loading}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          {...(props as any)}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={baseStyles}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

// ============================================
// ICON BUTTON
// ============================================

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

const iconButtonSizes: Record<"sm" | "md" | "lg", string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "ghost", size = "md", rounded = true, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center
          transition-all duration-200
          ${variantStyles[variant]}
          ${iconButtonSizes[size]}
          ${rounded ? "rounded-full" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default Button;
