/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AdminInfoPageProps {
  title: string;
  data: any;
  columns: any;
  isLoading: boolean;
  children?: React.ReactNode;
  appointments?: boolean;
  dataUpdatedAt: number;
  onRefetch: () => void;
  isFetching: boolean;
}
