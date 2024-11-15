import React from "react";

interface CustomCheckboxProps {
  checked: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any;
  label: string;
  type?: string;
  name?: string;
}

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  type,
  name
}: CustomCheckboxProps) => {
  return (
    <div>
      <label htmlFor={`check${type}${name}`}>
        <div
          className={`flex w-20 cursor-pointer items-center justify-center rounded-full border-[1px] border-black px-2 py-1 text-sm ${
            (type === "y" || undefined) && checked ? "bg-primary-amber" : ""
          } ${type === "n" && !checked ? "bg-primary-amber" : ""}`}
        >
          {label}
        </div>
      </label>
      <input
        type="checkbox"
        id={`check${type}${name}`}
        className="hidden"
        checked={checked}
        onChange={() => onChange(type === "y")}
      />
    </div>
  );
};

export default CustomCheckbox;
