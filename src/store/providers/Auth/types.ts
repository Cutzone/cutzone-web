"use client";

import SignUpForm from "@/validations/signUp";
import signUpUserForm from "@/validations/signUpUser";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";

type SignUpFormValidationData = z.infer<typeof SignUpForm>;
type SignUpUserFormValidationData = z.infer<typeof signUpUserForm>;

export interface AuthContextType {
  loginWithGoogleUser: () => void;
  loginWithFacebookUser: () => void;
  logoutUser: () => void;
  setUserUid: Dispatch<SetStateAction<string>>;
  userUid: string;
  createUserWithInternalService: ({
    email,
    owner,
    cpf,
    rg,
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
  } & { longitude: number }) => Promise<void>;
  createUser: (
    {
      email,
      password,
      name,
      cpf
    }: Omit<SignUpUserFormValidationData, "confirmPassword">,
    role: string
  ) => Promise<void>;
  loading: Record<string, boolean>;
  loginWithInternalService: (email: string, password: string) => void;
  forgotPassword: (email: string) => void;
  updatePassword: (password: string) => void;
  deleteUser: () => void;
}
