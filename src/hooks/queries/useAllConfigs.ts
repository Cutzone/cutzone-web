import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { getAllConfigs } from "@/store/services/config";
import { ConfigEntity } from "@/common/entities/config";
import { DocumentData } from "firebase/firestore";

export function getAllConfigsQueryKey() {
  return ["config"];
}

export const getAllConfigsQueryFn = () => {
  return () => getAllConfigs();
};

const useAllConfigs = <T = ConfigEntity[]>(
  select?: (data: DocumentData) => T
) => {
  return useQuery(getAllConfigsQueryKey(), getAllConfigsQueryFn(), {
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useAllConfigs;
