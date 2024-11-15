import { useQuery } from "@tanstack/react-query";

import {
  ONE_DAY_IN_MS,
  FORTY_FIVE_MINUTES_IN_MS
} from "@common/constants/generic";

import { getAllUsers } from "@/store/services/user";
import { DocumentData } from "firebase/firestore";
import { UserEntity } from "@/common/entities/user";

export function getAllUsersQueryKey() {
  return ["users"];
}

export const getAllUsersQueryFn = () => {
  return () => getAllUsers();
};

const useAllUsers = <T = UserEntity[]>(select?: (data: DocumentData) => T) => {
  return useQuery(getAllUsersQueryKey(), getAllUsersQueryFn(), {
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useAllUsers;
