"use client";
import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@hooks/useAuth";

export default function AdminPage() {
  const { userUid } = useAuth();
  const { data } = useProfile(userUid);
  return <section>Main</section>;
}
