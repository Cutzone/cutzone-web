/* eslint-disable @typescript-eslint/no-explicit-any */
import firebaseApp from "@/config/firebase";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { UserEntity } from "@/common/entities/user";
import { SubscriptionEntity } from "@/common/entities/subscription";
import { isSameDay, isSameHour, isSameMinute } from "date-fns";
import { timestampToDate } from "@/utils/timestampToDate";

const db = getFirestore(firebaseApp);
const tableName = "users";

export const createUserDoc = async ({
  id,
  email,
  name,
  cpf,
  phone,
  role,
  createdAt,
  barbaCredit,
  corteCredit,
  sobrancelhaCredit,
  favorites,
  tokens,
  suspended,
  subscriptionPeriodEnd
}: UserEntity) => {
  try {
    await setDoc(doc(db, "users", id || ""), {
      email,
      name,
      cpf,
      phone,
      role,
      createdAt,
      barbaCredit,
      corteCredit,
      sobrancelhaCredit,
      favorites,
      tokens,
      suspended,
      subscriptionPeriodEnd
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUser = async (id: string) => {
  return new Promise<DocumentData | null>((resolve, reject) => {
    const docRef = doc(db, tableName, id);
    getDoc(docRef)
      .then((data) => {
        const userData = data.data();
        resolve(userData || null);
      })
      .catch((error) => reject(error));
  });
};

export const getUserSubscriptions = async (id: string) => {
  const docRef = collection(db, tableName, id, "subscriptions");
  const q = query(docRef);
  const querySnapshot = await getDocs(q);
  const subscriptions: SubscriptionEntity[] = [];
  querySnapshot.forEach((doc) => {
    subscriptions.push({ ...doc.data(), id: doc.id } as SubscriptionEntity);
  });
  return subscriptions;
};

export const getAllUsers = async () => {
  const usersRef = collection(db, tableName);
  const q = query(usersRef);
  const querySnapshot = await getDocs(q);
  const users: UserEntity[] = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as UserEntity);
  });
  return users;
};

export const updateUserDocSupension = async ({
  id,
  suspended
}: {
  id: string;
  suspended: boolean;
}) => {
  try {
    await updateDoc(doc(db, tableName, id), {
      suspended
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUser = async (data: Partial<UserEntity>) => {
  try {
    const docRef = doc(db, tableName, data.id || "");
    await updateDoc(docRef, data);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUserAppointmentStatus = async ({
  companyId,
  employeeId,
  serviceId,
  userId,
  startTime,
  status
}: {
  companyId: string;
  employeeId: string;
  serviceId: string;
  userId: string;
  startTime: Date;
  status: string;
}) => {
  try {
    const userRef = doc(db, "users", userId);
    const appointmentsRef = collection(userRef, "appointments");

    const q = query(appointmentsRef);
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      const appointment = doc.data();
      if (
        appointment.idCompany === companyId &&
        appointment.idEmployee === employeeId &&
        appointment.idService === serviceId &&
        isSameDay(timestampToDate(appointment.startTime), startTime) &&
        isSameHour(timestampToDate(appointment.startTime), startTime) &&
        isSameMinute(timestampToDate(appointment.startTime), startTime)
      ) {
        await updateDoc(doc.ref, {
          status
        });
      }
    });

    return { error: null };
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
};

export const usersByPlan = async () => {
  const usersRef = collection(db, "users");
  const standardTier: UserEntity[] = [];
  const basicTier: UserEntity[] = [];
  const premiumTier: UserEntity[] = [];
  try {
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    let counter = 0;
    for (const doc of querySnapshot.docs) {
      counter++;
      const subsRef = collection(usersRef, doc.id, "subscriptions");
      const q = query(subsRef);
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        const subscription = doc.data();
        console.log("subscription", subscription);
        if (subscription.items[0].price.product.name) {
          console.log("counter", counter);
          const subscriptionName = subscription.items[0].price.product.name;
          if (subscriptionName.includes("Cria")) {
            standardTier.push(doc.data() as UserEntity);
          }
          if (subscriptionName.includes("Chavoso")) {
            basicTier.push(doc.data() as UserEntity);
          }
          if (subscriptionName.includes("Jogador")) {
            premiumTier.push(doc.data() as UserEntity);
          }
          console.log(
            "counter",
            subscriptionName.includes("Cria"),
            subscriptionName,
            subscription.items[0],
            doc.id
          );
        }
      }
    }
  } catch (error) {
    console.log("error", error);
  }

  return { standardTier, basicTier, premiumTier };
};
