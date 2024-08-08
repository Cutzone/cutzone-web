import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { DocumentData } from "firebase/firestore";
import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";
import { getAllPlataformAppointments } from "@/store/services/appointments";

export function getAllPlataformAppointmentsQueryKey() {
  return ["plataformAppointments"];
}

export const getAllPlataformAppointmentsQueryFn = () => {
  return () => getAllPlataformAppointments();
};

const useAllPlataformAppointments = <T = AppoitmentCompanyEntity[]>(
  select?: (data: DocumentData) => T
) => {
  return useQuery(
    getAllPlataformAppointmentsQueryKey(),
    getAllPlataformAppointmentsQueryFn(),
    {
      select,
      staleTime: FORTY_FIVE_MINUTES_IN_MS,
      cacheTime: ONE_DAY_IN_MS
    }
  );
};

export default useAllPlataformAppointments;
