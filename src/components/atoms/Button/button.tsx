import { twMerge } from "tailwind-merge";
import { ButtonProps } from "./types";

export default function Button({
  children,
  borderColor,
  textColor,
  hover,
  onClick,
  className,
  type,
  disabled = false
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        `${borderColor} ${textColor} rounded-full border-2 bg-none px-6 py-2 font-bold transition-all ${hover} disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200 disabled:opacity-80`,
        className
      )}
      onClick={onClick}
      type={type || "button"}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
