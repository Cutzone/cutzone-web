import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { usersByPlan } from "@/store/services/user";
import { DocumentData } from "firebase/firestore";
import { UserEntity } from "@/common/entities/user";

export function getUsersByPlanQueryKey() {
  return ["usersByPlan"];
}

export const getUsersByPlanQueryFn = () => {
  return () => usersByPlan();
};

const useUsersByPlan = <T = any>(select?: (data: DocumentData) => T) => {
  return useQuery(getUsersByPlanQueryKey(), getUsersByPlanQueryFn(), {
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useUsersByPlan;
