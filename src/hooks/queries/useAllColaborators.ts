import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { CollaboratorEntity } from "@/common/entities/collaborator";
import { getAllCollaborators } from "@/store/services/collaborators";
import { DocumentData } from "firebase/firestore";

export function getCollaboratorsQueryKey(bsid: string) {
  return ["collaborators", bsid];
}

export const getCollaboratorsQueryFn = (bsid: string) => {
  return () => getAllCollaborators(bsid);
};

const useAllColaborators = <T = CollaboratorEntity[]>(
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

export default useAllColaborators;
