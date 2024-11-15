"use client";

import FetchAuthState from "@templates/FetchAuth/fetchAuth";

interface Props {
  children: JSX.Element;
}

function PublicOnlyFeature({ children }: Props): JSX.Element {
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
