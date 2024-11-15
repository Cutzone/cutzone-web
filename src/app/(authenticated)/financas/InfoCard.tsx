import React from "react";
import { twMerge } from "tailwind-merge";

interface InfoCardProps {
  bgColor: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const InfoCard = ({
  bgColor,
  title,
  children,
  className,
  titleClassName
}: InfoCardProps) => {
  return (
    <div className={twMerge(`rounded-xl ${bgColor} p-4 pt-5`, className)}>
      <h3 className={twMerge(`mb-4 text-white`, titleClassName)}>{title}</h3>
      {children}
    </div>
  );
};

export default InfoCard;
