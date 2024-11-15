/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import UserContext from "./context";
import useAuth from "@hooks/useAuth";
import { BarberShopEntity } from "@/common/entities/barberShopEntity";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { updateUserDoc } from "@/store/services/barberShop";
import useProfile from "@/hooks/queries/useProfile";
import { getAllUsers } from "@/store/services/user";

interface Props {
  children: React.ReactNode;
}

const UserProvider = ({ children }: Props) => {
  const { userUid } = useAuth();
  const { data: user } = useProfile(userUid);
  const initialLoadingObject = {
    updateUserDoc: false,
    getAllUsers: false
  };
  const [loading, setLoading] = useState(initialLoadingObject);
  const [userObject, setUserObject] = useState<any>({} as any);
  const updateUser = async ({ id, email }: Partial<BarberShopEntity>) => {
    setLoading((prev) => ({ ...prev, updateUserDoc: true }));
    const finalUid = id ?? (user?.id || "");
    const { error } = await updateUserDoc(finalUid, email);
    if (!error) {
      successToast("Profile updated");
    }
    errorToast(error);
    setLoading((prev) => ({ ...prev, updateUserDoc: false }));
  };

  const fetchAllUsers = async () => {
    setLoading((prev) => ({ ...prev, getAllUsers: true }));
    const users = await getAllUsers();
    if (users.length === 0) {
      errorToast("Não foram encontrados usuários");
    }
    return users;
  };

  return (
    <UserContext.Provider
      value={{
        userObject,
        setUserObject,
        loading,
        updateUser,
        fetchAllUsers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
