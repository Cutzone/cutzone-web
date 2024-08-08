import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { DocumentData } from "firebase/firestore";
import { getAllCollaboratorsBlockedDates } from "@/store/services/blockedDate";
import { BlocekdDateEntity } from "@/common/entities/blockedDate";

export function getCollaboratorsQueryKey(bsid: string) {
  return ["blockedDatesCollab", bsid];
}

export const getCollaboratorsQueryFn = (bsid: string) => {
  return () => getAllCollaboratorsBlockedDates(bsid);
};

const useAllCollaboratorsBlockedDates = <T = BlocekdDateEntity[]>(
  bsid: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery(
    getCollaboratorsQueryKey(bsid),
    getCollaboratorsQueryFn(bsid),
    {
      select,
      staleTime: FORTY_FIVE_MINUTES_IN_MS,
      cacheTime: ONE_DAY_IN_MS
    }
  );
};

export default useAllCollaboratorsBlockedDates;
