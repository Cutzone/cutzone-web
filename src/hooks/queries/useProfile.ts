import { useQuery } from "@tanstack/react-query";

import { ONE_DAY_IN_MS, ONE_MINUTE_IN_MS } from "@common/constants/generic";

import { DocumentData } from "firebase/firestore";
import { getUser } from "@/store/services/user";
import { UserEntity } from "@/common/entities/user";
import { storageGet } from "@/store/services/storage";

export function getProfileQueryKey(uid: string) {
  return ["profile", uid];
}

export const getProfileQueryFn = (uid: string) => {
  return () => getUser(uid);
};

const useProfile = <T = UserEntity>(
  uid: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery(getProfileQueryKey(uid), getProfileQueryFn(uid), {
    select,
    enabled:
      uid !== "" &&
      (storageGet("role") === "user" || storageGet("role") === "admin"),
    staleTime: ONE_MINUTE_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useProfile;
