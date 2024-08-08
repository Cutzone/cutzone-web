import { BarberServicesEntity } from "@/common/entities/barberServicesEntity";
import { CollaboratorEntity } from "@/common/entities/collaborator";
import firebaseApp from "@/config/firebase";
import {
  DocumentData,
  addDoc,
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

const db = getFirestore(firebaseApp);
const tableName = "services";

export const createNewServiceDoc = async (
  {
    name,
    description,
    price,
    averageServiceTime,
    category,
    photo
  }: BarberServicesEntity,
  barberShopId: string
) => {
  try {
    const docRef = doc(db, "companies", barberShopId);
    const servicesColectionRef = collection(docRef, tableName);

    await addDoc(servicesColectionRef, {
      name,
      description,
      price,
      averageServiceTime,
      category,
      photo
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateServiceDoc = async (
  {
    name,
    description,
    price,
    averageServiceTime,
    category,
    photo
  }: BarberServicesEntity,
  id: string,
  barberShopId: string
) => {
  try {
    const barberRef = doc(db, "companies", barberShopId);
    const docRef = doc(barberRef, tableName, id);

    const res = await updateDoc(docRef, {
      name,
      description,
      price,
      averageServiceTime,
      category,
      photo
    });
    return { error: null, res };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getServiceDoc = async (id: string, barberShopId: string) => {
  return new Promise<DocumentData | null>((resolve, reject) => {
    const companyRef = doc(db, "companies", barberShopId);
    const docRef = doc(companyRef, tableName, id);

    getDoc(docRef)
      .then((data) => {
        const animalData = data.data();
        resolve(animalData || null);
      })
      .catch((error) => reject(error));
  });
};

export const deleteServiceDoc = async (id: string, barberShopId: string) => {
  try {
    const barberRef = doc(db, "companies", barberShopId);
    const docRef = doc(barberRef, tableName, id);
    await deleteDoc(docRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getAllServices = async (barberShopId: string) => {
  const barberShopRef = doc(db, "companies", barberShopId);
  const servicesRef = collection(barberShopRef, tableName);
  const q = query(servicesRef);
  const querySnapshot = await getDocs(q);
  const services: BarberServicesEntity[] = [];
  querySnapshot.forEach((doc) => {
    services.push({ id: doc.id, ...doc.data() } as BarberServicesEntity);
  });
  return services;
};
