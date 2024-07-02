import React from "react";

interface ButtonProps {
  text: string;
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  text,
  color = "bg-transparent",
  onClick,
  disabled = false,
  className = "",
  icon,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`border  flex items-center gap-[10px] disabled:cursor-not-allowed disabled:bg-grey disabled:text-dark-grey hover:bg-gray-100 transition-all text-[14px] px-[10px] tablet:px-[28px] py-[8px]" ${className} ${color}`}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
