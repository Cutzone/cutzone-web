export interface PlanEntity {
  id: string;
  name: string;
  description: string;
  active: boolean;
  price: number;
  priceId: string;
  benefits: string[];
}
