import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { usersByPlan } from "@/store/services/user";
import { DocumentData } from "firebase/firestore";

export function getUsersByPlanQueryKey() {
  return ["usersByPlan"];
}

export const getUsersByPlanQueryFn = () => {
  return () => usersByPlan();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useUsersByPlan = <T = any>(select?: (data: DocumentData) => T) => {
  return useQuery(getUsersByPlanQueryKey(), getUsersByPlanQueryFn(), {
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useUsersByPlan;
