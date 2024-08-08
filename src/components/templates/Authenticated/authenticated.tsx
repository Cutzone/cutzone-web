"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import FetchAuthState from "@templates/FetchAuth/fetchAuth";
import useAuth from "@/hooks/useAuth";
import LoadingComponent from "@atoms/Loading/loading";
import useProfile from "@/hooks/queries/useProfile";
import { storageGet } from "@/store/services/storage";

interface Props {
  children: JSX.Element;
}

function AuthenticatedOnlyFeature({ children }: Props): JSX.Element {
  const { userUid } = useAuth();
  const { data: user, isFetching } = useProfile(
    userUid !== "" ? userUid : storageGet("uid") || ""
  );
  const router = useRouter();

  useEffect(() => {
    if (
      userUid === "" &&
      (storageGet("uid") === undefined || storageGet("uid") === "")
    ) {
      router.push(`/`);
    }
  }, [userUid, router]);

  return children;
}

export default function AuthenticatedOnlyFeatureWrapper({
  children
}: Props): JSX.Element {
  return (
    <FetchAuthState>
      <AuthenticatedOnlyFeature>{children}</AuthenticatedOnlyFeature>
    </FetchAuthState>
  );
}
