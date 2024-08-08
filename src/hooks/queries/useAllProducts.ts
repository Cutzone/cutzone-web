import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { DocumentData } from "firebase/firestore";
import { getAllProducts } from "@/store/services/payment";
import { PlanEntity } from "@/common/entities/plan";

export function getAllProductsQueryKey() {
  return ["products"];
}

export const getAllProductsQueryFn = () => {
  return () => getAllProducts();
};

const useAllProducts = <T = PlanEntity[]>(
  select?: (data: DocumentData) => T
) => {
  return useQuery(getAllProductsQueryKey(), getAllProductsQueryFn(), {
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useAllProducts;
