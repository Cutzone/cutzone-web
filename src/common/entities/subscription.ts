import { Timestamp } from "firebase/firestore";

export interface SubscriptionEntity {
  id: string;
  created: Date | Timestamp;
  status: string;
  items: {
    price: {
      product: {
        metadata: {
          benefits: string;
        };
        name: string;
      };
    };
  }[];
}
