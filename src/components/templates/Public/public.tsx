"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import FetchAuthState from "@templates/FetchAuth/fetchAuth";
import useAuth from "@/hooks/useAuth";
import useProfile from "@/hooks/queries/useProfile";
import { storageGet } from "@/store/services/storage";

interface Props {
  children: JSX.Element;
}

function PublicOnlyFeature({ children }: Props): JSX.Element {
  const { userUid } = useAuth();
  const { data: user, isFetching } = useProfile(
    userUid !== "" ? userUid : storageGet("uid") || ""
  );
  const router = useRouter();

  // useEffect(() => {
  //   if (userUid || storageGet("uid")) {
  //     router.replace(`/gerenciamento`);
  //   }
  // }, [userUid, router]);

  return children;
}

export default function PublicOnlyFeatureWrapper({
  children
}: Props): JSX.Element {
  return (
    <FetchAuthState>
      <PublicOnlyFeature>{children}</PublicOnlyFeature>
    </FetchAuthState>
  );
}
