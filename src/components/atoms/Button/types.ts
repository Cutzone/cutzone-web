export interface ButtonProps {
  children: React.ReactNode;
  borderColor?: string;
  textColor?: string;
  hover?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}
