"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FetchAuthState from "@/components/templates/FetchAuth/fetchAuth";
import useProfile from "@/hooks/queries/useProfile";
import { storageGet } from "@/store/services/storage";

interface Props {
  children: JSX.Element;
}

function AdministratorOnlyFeature({ children }: Props): JSX.Element {
  const { data: user, isLoading } = useProfile(storageGet("uid") as string);
  const router = useRouter();
  const [componentDidMount, setComponentDidMount] = useState(false);

  useEffect(() => {
    setComponentDidMount(true);
  }, []);

  useEffect(() => {
    if (componentDidMount && !isLoading && user) {
      if (user?.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, isLoading, componentDidMount, router]);

  return children;
}

export default function AdministratorOnlyFeatureWrapper({
  children
}: Props): JSX.Element {
  return (
    <FetchAuthState>
      <AdministratorOnlyFeature>{children}</AdministratorOnlyFeature>
    </FetchAuthState>
  );
}
