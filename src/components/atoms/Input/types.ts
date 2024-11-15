/* eslint-disable @typescript-eslint/no-explicit-any */
export interface inputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  color?: string;
  label?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: any;
  value?: string;
  disabled?: boolean;
  name: string;
  formRegister: any;
  formErrors: any;
  setValue?: any;
  className?: string;
  mask?: string;
  type?: string;
  isRequired?: boolean;
}
