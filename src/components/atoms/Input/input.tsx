import { twMerge } from "tailwind-merge";
import FormErrorLabel from "../FormError/formError";
import { inputProps } from "./types";
import ReactInputMask from "react-input-mask";

export default function Input({
  bgColor,
  borderColor,
  textColor,
  label,
  placeholder,
  onChange,
  onBlur,
  value,
  disabled = false,
  name,
  formRegister,
  formErrors,
  setValue,
  className,
  mask,
  type,
  isRequired
}: inputProps) {
  return (
    <div className="w-full">
      <div
        className={twMerge(
          `relative my-3 rounded-full border-2 ${borderColor} p-2 ${
            disabled ? "bg-gray-200" : ""
          }`,
          className
        )}
      >
        <label
          className={`absolute left-5 top-[-14px] ${bgColor} ${textColor} rounded-full px-2 font-bold`}
          htmlFor={name}
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        {/* <input
          type="text"
          placeholder={placeholder}
          className={`w-full border-none px-4 focus:border-2 focus:border-red-500 ${
            disabled ? "bg-gray-200" : bgColor
          }`}
          value={value ? setValue(name, value) : undefined}
          disabled={disabled}
          id={name}
          {...formRegister(name)}
        /> */}
        <ReactInputMask
          className={`w-full border-none px-4 outline-none focus:border-2 focus:border-red-500 ${
            disabled ? "bg-gray-200" : bgColor
          }`}
          mask={mask || ""}
          alwaysShowMask={false}
          maskPlaceholder=""
          type={type || "text"}
          id={name}
          placeholder={placeholder}
          value={value ? setValue(name, value) : undefined}
          disabled={disabled}
          {...formRegister(name)}
          onBlur={onBlur || undefined}
        />
      </div>
      {formErrors[name]?.message && (
        <FormErrorLabel>{String(formErrors[name]?.message)}</FormErrorLabel>
      )}
    </div>
  );
}
