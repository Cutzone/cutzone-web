"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import FetchAuthState from "@templates/FetchAuth/fetchAuth";
import useAuth from "@/hooks/useAuth";
import { storageGet } from "@/store/services/storage";

interface Props {
  children: JSX.Element;
}

function AuthenticatedOnlyFeature({ children }: Props): JSX.Element {
  const { userUid } = useAuth();

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
