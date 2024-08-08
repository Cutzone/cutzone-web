import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";
import { getAllAppointments } from "@/store/services/appointments";
import { DocumentData } from "firebase/firestore";

export function getAppointmentsQueryKey() {
  return ["appointments"];
}

export const getAppointmentsQueryFn = (bsid: string) => {
  return () => getAllAppointments(bsid);
};

const useAllAppointments = <T = AppoitmentCompanyEntity[]>(
  bsid: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery(getAppointmentsQueryKey(), getAppointmentsQueryFn(bsid), {
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useAllAppointments;
