export interface RefetchButtonProps {
  onRefetch: () => void;
  isLoading: boolean;
  dataUpdatedAt: number;
  className?: string;
}
