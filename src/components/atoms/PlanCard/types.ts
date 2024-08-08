export interface PlanCardProps {
  tier: string;
  price: number | string;
  description: string;
  onClick: () => void;
  isSelected: boolean;
}
