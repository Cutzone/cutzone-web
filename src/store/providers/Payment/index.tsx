"use client";

import { useCallback, useState } from "react";

import app from "@/config/firebase";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

import PaymentContext from "./context";
import { storageGet } from "@/store/services/storage";
import { PlanEntity } from "@/common/entities/plan";

interface Props {
  children: React.ReactNode;
}

const PaymentProvider = ({ children }: Props) => {
  const initialLoadingObject = {
    getCheckoutUrl: false,
    getPortalUrl: false,
    getPlanName: false
  };
  const [loading, setLoading] = useState(initialLoadingObject);
  const db = getFirestore(app);

  const getCheckoutUrl = async (priceId: string): Promise<string> => {
    setLoading((prev) => ({ ...prev, getCheckoutUrl: true }));
    if (
      (storageGet("uid") as string) === undefined ||
      (storageGet("uid") as string) === ""
    )
      throw new Error("User is not authenticated");

    const checkoutSessionRef = collection(
      db,
      "users",
      (storageGet("uid") as string) || "",
      "checkout_sessions"
    );

    const docRef = await addDoc(checkoutSessionRef, {
      price: priceId,
      success_url: `${process.env.NEXT_PUBLIC_FINISH_PAYMENT_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_FINISH_PAYMENT_URL}/?canceled=true`,
      locale: "pt-BR"
    });

    setTimeout(() => {
      setLoading((prev) => ({ ...prev, getCheckoutUrl: false }));
    }, 10000);

    return new Promise<string>((resolve, reject) => {
      const unsubscribe = onSnapshot(docRef, (snap) => {
        const { error, url } = snap.data() as {
          error?: { message: string };
          url?: string;
        };

        if (error) {
          unsubscribe();
          reject(new Error(`An error occurred: ${error.message}`));
        }
        if (url) {
          unsubscribe();
          resolve(url);
        }
      });
    });
  };

  const getPortalUrl = async (): Promise<string> => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dataWithUrl: any;
    setLoading((prev) => ({ ...prev, getPortalUrl: true }));

    try {
      const functions = getFunctions(app, "us-central1");
      const functionRef = httpsCallable(
        functions,
        "ext-firestore-stripe-payments-createPortalLink"
      );
      const { data } = await functionRef({
        customerId: user?.uid,
        returnUrl: `${process.env.NEXT_PUBLIC_FINISH_PAYMENT_URL}/?success=true`,
        locale: "pt-BR"
      });

      dataWithUrl = data as { url: string };
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => {
      setLoading((prev) => ({ ...prev, getPortalUrl: false }));
    }, 10000);

    return new Promise<string>((resolve, reject) => {
      if (dataWithUrl.url) {
        resolve(dataWithUrl.url);
      } else {
        reject(new Error("No url returned"));
      }
    });
  };

  const getPlanName = useCallback(
    (userUid: string, productsDb: PlanEntity[]) => {
      if (
        (storageGet("uid") as string) === undefined ||
        (storageGet("uid") as string) === ""
      )
        throw new Error("User is not authenticated");

      console.log(db);
      console.log(userUid);
      const subscriptionsRef = collection(
        db,
        "users",
        userUid,
        "subscriptions"
      );

      const q = query(
        subscriptionsRef,
        where("status", "in", ["trialing", "active"])
      );

      setLoading((prev) => ({ ...prev, getPlanName: true }));
      return new Promise<{ planName: string; isActive: null | boolean }>(
        (resolve, reject) => {
          const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              // In this implementation we only expect one active or trialing subscription to exist.

              console.log(productsDb);

              if (snapshot.docs.length === 0) {
                resolve({ planName: "Autenticado", isActive: null });
              } else {
                const subscription = snapshot.docs[0].data();
                const planPriceId = subscription.items[0].plan.id;
                console.log(planPriceId);
                const isPlanActive = !subscription.cancel_at;
                const planName =
                  productsDb !== undefined
                    ? productsDb.find(
                        (product) => product.priceId === planPriceId
                      )?.name
                    : undefined;

                if (planName === undefined) {
                  reject(Error("Plan name undefined"));
                } else {
                  resolve({ planName, isActive: isPlanActive });
                }
              }
              unsubscribe();
            },
            reject
          );
          setLoading((prev) => ({ ...prev, getPlanName: false }));
        }
      );
    },
    []
  );

  return (
    <PaymentContext.Provider
      value={{
        getCheckoutUrl,
        getPortalUrl,
        getPlanName,
        loading
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;
