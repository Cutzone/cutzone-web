import firebaseApp from "@/config/firebase";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { BarberShopEntity } from "@/common/entities/barberShopEntity";

const db = getFirestore(firebaseApp);
const tableName = "companies";

export const createNewUserDoc = async ({
  id,
  owner,
  email,
  name,
  cellphone,
  rg,
  cpf,
  cnpj,
  bank,
  bankAccount,
  bankAgency,
  pix,
  cep,
  address,
  neighborhood,
  number,
  city,
  latitude,
  longitude,
  state,
  flags,
  aproved,
  rejected,
  createdAt,
  rating,
  tier,
  suspended,
  status
}: BarberShopEntity) => {
  try {
    await setDoc(doc(db, tableName, id || ""), {
      email,
      owner,
      name,
      cellphone,
      rg,
      cpf,
      cnpj,
      bank,
      bankAccount,
      bankAgency,
      pix,
      cep,
      address,
      neighborhood,
      number,
      city,
      latitude,
      longitude,
      state,
      flags,
      aproved,
      rejected,
      createdAt,
      rating,
      tier,
      suspended,
      status
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const createNewUserDocGoogle = async ({
  id,
  email,
  name,
  flags,
  aproved,
  createdAt,
  rejected,
  rating,
  tier,
  suspended,
  status
}: BarberShopEntity) => {
  try {
    await setDoc(doc(db, tableName, id || ""), {
      email,
      name,
      flags,
      aproved,
      createdAt,
      rating,
      rejected,
      tier,
      suspended,
      status
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUserDoc = async (id: string) => {
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

export const updateUserDoc = async (
  uid: string,
  email?: string,
  name?: string,
  dob?: Date,
  phone?: string
) => {
  try {
    await updateDoc(doc(db, tableName, uid), {
      email,
      name,
      dob,
      phone
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateBarberDocFlags = async ({
  id,
  flags,
  aproved,
  status
}: {
  id: string;
  flags: boolean[];
  aproved: boolean;
  status: string;
}) => {
  try {
    await updateDoc(doc(db, tableName, id), {
      flags,
      aproved,
      status
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateBarberDocApproved = async ({
  id,
  aproved,
  aprovedAt,
  tier,
  status
}: {
  id: string;
  aproved: boolean;
  aprovedAt: Date;
  tier: string;
  status: string;
}) => {
  try {
    await updateDoc(doc(db, tableName, id), {
      aproved,
      aprovedAt,
      tier,
      status
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateBarberDocRejected = async ({
  id,
  rejected,
  rejectedAt,
  reason,
  status
}: {
  id: string;
  rejected: boolean;
  rejectedAt: Date;
  reason: string;
  status: string;
}) => {
  try {
    await updateDoc(doc(db, tableName, id), {
      rejected,
      rejectedAt,
      reason,
      status
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateBarberDocSupension = async ({
  id,
  suspended,
  status
}: {
  id: string;
  suspended: boolean;
  status: string;
}) => {
  try {
    await updateDoc(doc(db, tableName, id), {
      suspended,
      status
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUserDocAdress = async ({
  id,
  cep,
  address,
  neighborhood,
  number,
  city,
  state,
  name,
  cellphone,
  latitude,
  longitude
}: {
  id: string;
  cep?: string;
  address?: string;
  neighborhood?: string;
  state?: string;
  city?: string;
  number?: string;
  name?: string;
  cellphone?: string;
  latitude?: number;
  longitude?: number;
}) => {
  try {
    await updateDoc(doc(db, tableName, id), {
      cep,
      address,
      neighborhood,
      number,
      city,
      state,
      name,
      cellphone,
      latitude,
      longitude
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateBarberDocInitialInfo = async ({
  id,
  description,
  mainPhoto,
  photos,
  style
}: {
  id: string;
  description: string;
  mainPhoto: string;
  photos: string[];
  style: string;
}) => {
  try {
    await updateDoc(doc(db, tableName, id), {
      description,
      mainPhoto,
      photos,
      style
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateBarberDocServicesInfo = async ({
  id,
  workDays,
  startTimeWork,
  endTimeWork,
  lunchBreakInterval,
  lunchBreakIntervalStart,
  lunchBreakIntervalEnd,
  cancelTime,
  maxAppointmentTime
}: {
  id: string;
  workDays?: boolean[];
  startTimeWork?: string;
  endTimeWork?: string;
  lunchBreakInterval?: boolean;
  lunchBreakIntervalStart?: string;
  lunchBreakIntervalEnd?: string;
  cancelTime?: number;
  maxAppointmentTime?: number;
}) => {
  try {
    await updateDoc(doc(db, tableName, id), {
      workDays,
      startTimeWork,
      endTimeWork,
      lunchBreakInterval,
      lunchBreakIntervalStart,
      lunchBreakIntervalEnd,
      cancelTime,
      maxAppointmentTime
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateMyBarberShopInfo = async ({
  id,
  workDays,
  startTimeWork,
  endTimeWork,
  lunchBreakInterval,
  lunchBreakIntervalStart,
  lunchBreakIntervalEnd,
  description,
  mainPhoto,
  photos,
  cancelTime,
  maxAppointmentTime
}: {
  id: string;
  workDays: boolean[];
  startTimeWork: string;
  endTimeWork: string;
  lunchBreakInterval: boolean;
  lunchBreakIntervalStart: string;
  lunchBreakIntervalEnd: string;
  description: string;
  mainPhoto: string;
  photos: string[];
  cancelTime: number;
  maxAppointmentTime: number;
}) => {
  try {
    await updateDoc(doc(db, tableName, id), {
      workDays,
      startTimeWork,
      endTimeWork,
      lunchBreakInterval,
      lunchBreakIntervalStart,
      lunchBreakIntervalEnd,
      description,
      mainPhoto,
      photos,
      cancelTime,
      maxAppointmentTime
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteUserDoc = async (id: string) => {
  try {
    await deleteDoc(doc(db, tableName, id));
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteBarberShopDoc = async (id: string) => {
  try {
    await deleteDoc(doc(db, tableName, id));
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getAllBarberShops = async () => {
  const companyRef = collection(db, tableName);
  const q = query(companyRef);
  const querySnapshot = await getDocs(q);
  const company: BarberShopEntity[] = [];
  querySnapshot.forEach((doc) => {
    company.push({ id: doc.id, ...doc.data() } as BarberShopEntity);
  });
  return company;
};
