import React from "react";
import clsx from "clsx";
import "./Button.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "solid" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "outline",
      size = "md",
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          "kodara-button",
          `kodara-button--${variant}`,
          `kodara-button--${size}`,
          {
            "kodara-button--full": fullWidth,
            "kodara-button--disabled": disabled,
          },
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && <span className="kodara-button__icon">{icon}</span>}
        {children && <span className="kodara-button__label">{children}</span>}
        {icon && iconPosition === "right" && <span className="kodara-button__icon">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
