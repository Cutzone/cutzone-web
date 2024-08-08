"use client";

import { createContext } from "react";
import { PaymentContextType } from "./types";

const PaymentContext = createContext<PaymentContextType>(
  {} as PaymentContextType
);

export default PaymentContext;
