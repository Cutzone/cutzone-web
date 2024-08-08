import { FormErrorProps } from "./types";

export default function FormErrorLabel({ children }: FormErrorProps) {
  return <p className="ml-2 self-center text-xs text-red-600">{children}</p>;
}
