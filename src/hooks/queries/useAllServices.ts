import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { BarberServicesEntity } from "@/common/entities/barberServicesEntity";
import { getAllServices } from "@/store/services/services";
import { DocumentData } from "firebase/firestore";

export function getServicesQueryKey(bsid: string) {
  return ["services", bsid];
}

export const getServicesQueryFn = (bsid: string) => {
  return () => getAllServices(bsid);
};

const useAllServices = <T = BarberServicesEntity[]>(
  bsid: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery(getServicesQueryKey(bsid), getServicesQueryFn(bsid), {
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useAllServices;
