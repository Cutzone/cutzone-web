import PaymentContext from "@providers/Payment/context";
import type { PaymentContextType } from "@store/providers/Payment/types";
import { useContext } from "react";

export default function usePayment(): PaymentContextType {
  return useContext(PaymentContext);
}
