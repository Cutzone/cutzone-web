"use client";

import { BarberShopEntity as UserDoc } from "@/common/entities/barberShopEntity";
import { useState } from "react";
import AuthContext from "./context";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SignUpForm from "@/validations/signUp";
import signUpUserForm from "@/validations/signUpUser";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { z } from "zod";
import {
  createUserWithEmailAndPasswordLocal,
  deleteOwnAccount,
  loginWithFacebook,
  loginWithGoogle,
  logout,
  recoverPassword,
  signInWithEmailAndPasswordLocal
} from "@/store/services/auth";
import {
  createNewUserDoc,
  deleteUserDoc,
  getUserDoc
} from "@/store/services/barberShop";
import { storageSet } from "@/store/services/storage";
import { createUserDoc, getUser } from "@/store/services/user";
import useUser from "@/hooks/useUser";

interface Props {
  children: React.ReactNode;
}

export type UserType = UserDoc | null;
type SignUpFormValidationData = z.infer<typeof SignUpForm>;
type SignUpUserFormValidationData = z.infer<typeof signUpUserForm>;

const AuthProvider = ({ children }: Props) => {
  const [userUid, setUserUid] = useState<string>("");

  const initialLoadingObject = {
    onAuthUserChanged: false,
    loginWithGoogle: false,
    loginWithFacebook: false,
    loginWithInternalService: false,
    createUserWithInternalService: false,
    forgotPassword: false,
    updatePassword: false,
    deleteUser: false,
    logout: false
  };
  const [loading, setLoading] = useState(initialLoadingObject);
  const { setUserObject } = useUser();
  const router = useRouter();

  const loginWithGoogleUser = async () => {
    setLoading((prev) => ({ ...prev, loginWithGoogle: true }));
    const { user, error } = await loginWithGoogle();
    const barberShop = await getUserDoc(user?.uid || "");
    const userDoc = await getUser(user?.uid || "");

    if (user && !userDoc && !barberShop) {
      const userObj = {
        id: user?.uid,
        email: user.email ?? "",
        name: user.displayName ?? "",
        createdAt: new Date()
      };

      setUserObject(userObj);
      // await createNewUserDocGoogle({
      //   id: user?.uid,
      //   email: user.email ?? "",
      //   name: user.displayName ?? "",
      //   createdAt: new Date(),
      //   flags: [true, false, false, false, false, false],
      //   aproved: false
      // });
      setUserUid(user.uid);
      storageSet("uid", user.uid);
      toast("Bem vindo!", { type: "success" });
      router.push("/selecao-cadastro");
    } else {
      if (!barberShop && userDoc) {
        if (userDoc.role === "admin") {
          router.push("/admin/usuarios");
          storageSet("role", "admin");
        } else {
          router.push("/meu-perfil");
          storageSet("role", "user");
        }
      } else {
        storageSet("role", "barber");
        router.push("/gerenciamento");
      }
      storageSet("uid", user?.uid || "");
      setUserUid(user?.uid || "");
      toast("Bem vindo de volta!", { type: "success" });
    }
    if (error) {
      errorToast("Erro ao fazer login com Google.");
    }
    setLoading((prev) => ({ ...prev, loginWithGoogle: false }));
  };

  const loginWithFacebookUser = async () => {
    setLoading((prev) => ({ ...prev, loginWithFacebook: true }));
    const { user } = await loginWithFacebook();

    const barberShop = await getUserDoc(user?.uid || "");
    const userDoc = await getUser(user?.uid || "");

    if (user && !userDoc && !barberShop) {
      const userObj = {
        id: user?.uid,
        email: user.email ?? "",
        name: user.displayName ?? "",
        createdAt: new Date()
      };

      setUserObject(userObj);
      setUserUid(user.uid);
      storageSet("uid", user.uid);
      toast("Bem vindo!", { type: "success" });
      router.push("/selecao-cadastro");
    } else {
      if (!barberShop && userDoc) {
        if (userDoc.role === "admin") {
          router.push("/admin/usuarios");
          storageSet("role", "admin");
        } else {
          router.push("/meu-perfil");
          storageSet("role", "user");
        }
      } else {
        storageSet("role", "barber");
        router.push("/gerenciamento");
      }
      storageSet("uid", user?.uid || "");
      setUserUid(user?.uid || "");
      toast("Bem vindo de volta!", { type: "success" });
    }
    errorToast("Erro ao fazer login com Facebook.");
    setLoading((prev) => ({ ...prev, loginWithFacebook: false }));
  };

  const loginWithInternalService = async (email: string, password: string) => {
    setLoading((prev) => ({ ...prev, loginWithInternalService: true }));
    const { error, user } = await signInWithEmailAndPasswordLocal(
      email,
      password
    );
    if (user && !user?.emailVerified) {
      errorToast("Por favor, verifique seu email");
      setLoading((prev) => ({ ...prev, loginWithInternalService: false }));
      logout();
      return;
    }
    if (user) {
      successToast("Bem vindo de volta!");
    }

    try {
      const barberShop = await getUserDoc(user?.uid || "");

      const userDoc = await getUser(user?.uid || "");

      if (!barberShop && userDoc) {
        if (userDoc.role === "admin") {
          router.push("/admin/usuarios");
          storageSet("role", "admin");
        } else {
          router.push("/meu-perfil");
          storageSet("role", "user");
        }
      } else {
        storageSet("role", "barber");
        router.push("/gerenciamento");
      }
    } catch (e) {}

    storageSet("uid", user?.uid || "");
    setUserUid(user?.uid || "");
    if (error) {
      errorToast("Não foi possível fazer login, verifique suas credenciais.");
    }
    setLoading((prev) => ({ ...prev, loginWithInternalService: false }));
  };

  const createUserWithInternalService = async ({
    email,
    owner,
    rg,
    cpf,
    cnpj,
    bank,
    bankAccount,
    bankAgency,
    pix,
    password,
    name,
    cellphone,
    cep,
    address,
    neighborhood,
    number,
    state,
    city,
    latitude,
    longitude
  }: Omit<SignUpFormValidationData, "confirmPassword"> & {
    latitude: number;
  } & { longitude: number }) => {
    if (email && password) {
      setLoading((prev) => ({ ...prev, createUserWithInternalService: true }));
      const { error, user } = await createUserWithEmailAndPasswordLocal(
        email,
        password
      );
      if (error) {
        if (error === "Firebase: Error (auth/email-already-in-use).") {
          errorToast("Esse email já foi cadastrado.");
        } else {
          errorToast("Erro ao criar conta, tente novamente.");
        }
        setLoading((prev) => ({
          ...prev,
          createUserWithInternalService: false
        }));
        return;
      }
      await createNewUserDoc({
        id: user?.uid || "",
        owner,
        rg,
        cpf,
        cnpj,
        bank,
        bankAccount,
        bankAgency,
        pix,
        email,
        name,
        cellphone,
        cep: String(cep),
        address,
        neighborhood,
        number,
        state,
        city,
        latitude,
        longitude,
        createdAt: new Date(),
        flags: [true, true, false, false, false, false],
        aproved: false,
        rejected: false,
        rating: 0,
        tier: "null",
        suspended: false,
        status: "creating"
      });
      setUserUid(user?.uid || "");
      storageSet("uid", user?.uid || "");
      storageSet("role", "barber");
      toast("Conta criada, verifique seu email", { type: "success" });
      router.push("/gerenciamento");
      setLoading((prev) => ({ ...prev, createUserWithInternalService: false }));
    } else {
      errorToast("Email e senha são obrigatórios");
    }
  };

  const createUser = async (
    {
      email,
      password,
      name,
      cpf,
      phone
    }: Omit<SignUpUserFormValidationData, "confirmPassword">,
    role: string
  ) => {
    if (email && password) {
      setLoading((prev) => ({ ...prev, createUserWithInternalService: true }));
      const { error, user } = await createUserWithEmailAndPasswordLocal(
        email,
        password
      );
      if (error) {
        if (error === "Firebase: Error (auth/email-already-in-use).") {
          errorToast("Esse email já foi cadastrado.");
        } else {
          errorToast("Erro ao criar conta, tente novamente.");
        }
        setLoading((prev) => ({
          ...prev,
          createUserWithInternalService: false
        }));
        return;
      }
      const res = await createUserDoc({
        id: user?.uid || "",
        email,
        name,
        cpf,
        phone,
        createdAt: new Date(),
        role,
        suspended: false,
        barbaCredit: 0,
        corteCredit: 0,
        sobrancelhaCredit: 0,
        favorites: [],
        tokens: [],
        subscriptionPeriodEnd: null
      });
      console.log(res);
      setUserUid(user?.uid || "");
      storageSet("uid", user?.uid || "");
      toast("Conta criada, verifique seu email", { type: "success" });
      if (role === "user") {
        router.push("/meu-perfil");
        storageSet("role", "user");
      } else if (role === "admin") {
        router.push("/admin/usuarios");
        storageSet("role", "admin");
      }
      setLoading((prev) => ({ ...prev, createUserWithInternalService: false }));
    } else {
      errorToast("Email e senha são obrigatórios");
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading((prev) => ({ ...prev, forgotPassword: true }));
    const { error } = await recoverPassword(email);
    if (!error) {
      toast("Email enviado!", { type: "success" });
    } else {
      const errorMessage =
        error === "Firebase: Error (auth/user-not-found)."
          ? "Email não encontrado"
          : "Erro ao enviar email";
      errorToast(errorMessage);
    }
    setLoading((prev) => ({ ...prev, forgotPassword: false }));
  };

  const updatePassword = async (password: string) => {
    setLoading((prev) => ({ ...prev, updatePassword: true }));
    // const { error } =
    await updatePassword(password);
    // if (!error) {
    //   toast("Password updated", { type: "success" });
    // }
    // errorToast(error);
    setLoading((prev) => ({ ...prev, updatePassword: false }));
  };

  const deleteUser = async () => {
    setLoading((prev) => ({ ...prev, deleteUser: true }));
    // const { error } =
    await deleteOwnAccount();
    await deleteUserDoc(userUid);
    storageSet("uid", "");
    // if (!error) {
    //   setUser(null);
    //   toast("Account deleted", { type: "success" });
    // }
    // errorToast(error);
    setLoading((prev) => ({ ...prev, deleteUser: false }));
  };

  const logoutUser = async () => {
    setLoading((prev) => ({ ...prev, logout: true }));
    router.push("/");
    setUserUid("");
    storageSet("uid", "");
    storageSet("role", "");
    logout();
    setLoading((prev) => ({ ...prev, logout: false }));
  };

  return (
    <AuthContext.Provider
      value={{
        userUid,
        loading,
        updatePassword,
        forgotPassword,
        loginWithGoogleUser,
        loginWithFacebookUser,
        loginWithInternalService,
        logoutUser,
        setUserUid,
        deleteUser,
        createUserWithInternalService,
        createUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
