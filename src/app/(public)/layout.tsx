"use client";

import Footer from "@/components/molecules/Footer";
import Header from "@/components/molecules/Header";
import PublicOnlyFeature from "@templates/Public/public";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSingUpOpen, setIsSingUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <PublicOnlyFeature>
      <>
        <Header
          isSingUpOpen={isSingUpOpen}
          setIsSingUpOpen={setIsSingUpOpen}
          isLoginOpen={isLoginOpen}
          setIsLoginOpen={setIsLoginOpen}
        />
        <section>{children}</section>
        <Footer />
      </>
    </PublicOnlyFeature>
  );
}
