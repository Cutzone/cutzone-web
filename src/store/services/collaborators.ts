/* eslint-disable @typescript-eslint/no-explicit-any */
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
  updateDoc
} from "firebase/firestore";

const db = getFirestore(firebaseApp);
const tableName = "collaborators";

export const createNewCollaboratorDoc = async (
  { name, email, age, pix, profession, photo }: CollaboratorEntity,
  barberShopId: string
) => {
  try {
    const docRef = doc(db, "companies", barberShopId);
    const collabColectionRef = collection(docRef, tableName);

    await addDoc(collabColectionRef, {
      name,

      email,
      age,
      pix,
      profession,
      photo
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCollaboratorDoc = async (id: string, barberShopId: string) => {
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

export const updateCollaboratorDoc = async (
  { name, email, age, pix, profession, photo }: CollaboratorEntity,
  id: string,
  barberShopId: string
) => {
  try {
    const barberRef = doc(db, "companies", barberShopId);
    const docRef = doc(barberRef, tableName, id);

    const res = await updateDoc(docRef, {
      name,
      email,
      age,
      pix,
      profession,
      photo
    });
    return { error: null, res };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteCollaboratorDoc = async (
  id: string,
  barberShopId: string
) => {
  try {
    const barberRef = doc(db, "companies", barberShopId);
    const docRef = doc(barberRef, tableName, id);
    await deleteDoc(docRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getAllCollaborators = async (barberShopId: string) => {
  const barberShopRef = doc(db, "companies", barberShopId);
  const collaboratorsRef = collection(barberShopRef, tableName);
  const q = query(collaboratorsRef);
  const querySnapshot = await getDocs(q);
  const collaborators: CollaboratorEntity[] = [];
  querySnapshot.forEach((doc) => {
    collaborators.push({ id: doc.id, ...doc.data() } as CollaboratorEntity);
  });
  return collaborators;
};
