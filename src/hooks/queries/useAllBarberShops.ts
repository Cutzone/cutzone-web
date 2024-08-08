import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { DocumentData } from "firebase/firestore";
import { getAllBarberShops } from "@/store/services/barberShop";
import { BarberShopEntity } from "@/common/entities/barberShopEntity";

export function getAllBarberShopsQueryKey() {
  return ["barberShops"];
}

export const getAllBarberShopsQueryFn = () => {
  return () => getAllBarberShops();
};

const useAllBarberShops = <T = BarberShopEntity[]>(
  select?: (data: DocumentData) => T
) => {
  return useQuery(getAllBarberShopsQueryKey(), getAllBarberShopsQueryFn(), {
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useAllBarberShops;
