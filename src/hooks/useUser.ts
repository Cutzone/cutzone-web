import UserContext from "@providers/User/context";
import type { UserContextType } from "@/store/providers/User/types";
import { useContext } from "react";

export default function useUser(): UserContextType {
  return useContext(UserContext);
}
