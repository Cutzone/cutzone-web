import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { DocumentData } from "firebase/firestore";
import { getAllBarberShopBlockedDates } from "@/store/services/blockedDate";
import { BlocekdDateEntity } from "@/common/entities/blockedDate";

export function getBsBlockedDatesQueryKey(bsid: string) {
  return ["blockedDates", bsid];
}

export const getBsBlockedDatesQueryFn = (bsid: string) => {
  return () => getAllBarberShopBlockedDates(bsid);
};

const useAllBsBlockedDates = <T = BlocekdDateEntity[]>(
  bsid: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery(
    getBsBlockedDatesQueryKey(bsid),
    getBsBlockedDatesQueryFn(bsid),
    {
      select,
      staleTime: FORTY_FIVE_MINUTES_IN_MS,
      cacheTime: ONE_DAY_IN_MS
    }
  );
};

export default useAllBsBlockedDates;
