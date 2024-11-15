import { PlanEntity } from "@/common/entities/plan";

export interface PaymentContextType {
  getCheckoutUrl: (priceId: string) => Promise<string>;
  getPortalUrl: () => Promise<string>;
  getPlanName: (
    userUid: string,
    productsDb: PlanEntity[]
  ) => Promise<{ planName: string; isActive: boolean | null }>;
  loading: {
    getCheckoutUrl: boolean;
    getPortalUrl: boolean;
    getPlanName: boolean;
  };
}
