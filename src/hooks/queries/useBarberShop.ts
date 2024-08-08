import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { BarberShopEntity } from "@/common/entities/barberShopEntity";
import { getUserDoc } from "@/store/services/barberShop";
import { DocumentData } from "firebase/firestore";
import { storageGet } from "@/store/services/storage";

export function getBarberShopQueryKey(uid: string) {
  return ["barberShop", uid];
}

export const getBarberShopQueryFn = (uid: string) => {
  return () => getUserDoc(uid);
};

const useBarberShop = <T = BarberShopEntity>(
  uid: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery(getBarberShopQueryKey(uid), getBarberShopQueryFn(uid), {
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS,
    enabled: storageGet("role") === "barber" || storageGet("role") === "admin"
  });
};

export default useBarberShop;
