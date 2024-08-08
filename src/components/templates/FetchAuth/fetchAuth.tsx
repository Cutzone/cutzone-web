"use client";

import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";
import { storageGet } from "@/store/services/storage";
import LoadingComponent from "@atoms/Loading/loading";
import { useEffect, useState } from "react";

interface Props {
  children: JSX.Element;
}

export default function FetchAuthState({ children }: Props) {
  const { userUid } = useAuth();
  const { data: user, isFetching } = useProfile(
    userUid !== "" ? userUid : storageGet("uid") || ""
  );

  if (isFetching && userUid !== "") {
    return <LoadingComponent />;
  }

  return children;
}
