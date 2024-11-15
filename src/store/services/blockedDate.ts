/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlocekdDateEntity } from "@/common/entities/blockedDate";
import firebaseApp from "@/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query
} from "firebase/firestore";
import {
  cancelAppointmentsBarbershop,
  cancelAppointmentsCollaborators
} from "./appointments";

const db = getFirestore(firebaseApp);
const tableName = "blockedDates";

export const createNewCollaboratorBlockedDateDoc = async (
  {
    collaboratorId,
    collaboratorName,
    companyName,
    createdAt,
    endDate,
    startDate,
    type,
    startTime,
    endTime
  }: BlocekdDateEntity,
  barberShopId: string
) => {
  try {
    if (!collaboratorId) return { error: "Collaborator id is required" };
    const docRef = doc(db, "companies", barberShopId);
    const collabDocRef = doc(docRef, "collaborators", collaboratorId);
    const blockedDatesCollectionRef = collection(collabDocRef, tableName);

    await addDoc(blockedDatesCollectionRef, {
      collaboratorId,
      collaboratorName,
      companyName,
      createdAt,
      endDate,
      startDate,
      type,
      startTime,
      endTime
    });

    const res = await cancelAppointmentsCollaborators({
      bsid: barberShopId,
      collaboratorId,
      type,
      startDate: startDate as Date,
      endDate: endDate as Date,
      startTime,
      endTime
    });
    console.log(res);
    return { error: null };
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
};

export const createNewBarberShopBlockedDateDoc = async (
  {
    collaboratorId,
    collaboratorName,
    companyName,
    createdAt,
    endDate,
    startDate,
    type,
    startTime,
    endTime
  }: BlocekdDateEntity,
  barberShopId: string
) => {
  try {
    const collectionRef = collection(db, "companies", barberShopId, tableName);
    await addDoc(collectionRef, {
      collaboratorId,
      collaboratorName,
      companyName,
      createdAt,
      endDate,
      startDate,
      type,
      startTime,
      endTime
    });

    const res = await cancelAppointmentsBarbershop({
      bsid: barberShopId,
      collaboratorId,
      type,
      startDate: startDate as Date,
      endDate: endDate as Date,
      startTime,
      endTime
    });
    console.log(res);

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getAllBarberShopBlockedDates = async (barberShopId: string) => {
  const barberShopRef = doc(db, "companies", barberShopId);
  const blockedDatesRef = collection(barberShopRef, tableName);
  const q = query(blockedDatesRef);
  const querySnapshot = await getDocs(q);
  const blockedDates: BlocekdDateEntity[] = [];
  querySnapshot.forEach((doc) => {
    blockedDates.push({ id: doc.id, ...doc.data() } as BlocekdDateEntity);
  });
  return blockedDates;
};

export const getAllCollaboratorsBlockedDates = async (barberShopId: string) => {
  try {
    const docRef = doc(db, "companies", barberShopId);
    const collaboratorsCollectionRef = collection(docRef, "collaborators");
    const q = query(collaboratorsCollectionRef);
    const querySnapshot = await getDocs(q);

    const blockedDates: BlocekdDateEntity[] = [];
    for (const doc of querySnapshot.docs) {
      const blockedDatesRef = collection(
        collaboratorsCollectionRef,
        doc.id,
        tableName
      );
      const q = query(blockedDatesRef);
      const querySnap = await getDocs(q);
      for (const doc of querySnap.docs) {
        blockedDates.push({ id: doc.id, ...doc.data() } as BlocekdDateEntity);
      }
    }
    return blockedDates;
  } catch (error: any) {
    console.log(error);
  }
};

export const deleteBarberShopBlockedDateDoc = async (
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

export const deleteCollaboratorBlockedDateDoc = async (
  collaboratorId: string,
  barberShopId: string,
  docId: string
) => {
  try {
    const barberRef = doc(db, "companies", barberShopId);
    const collabRef = doc(barberRef, "collaborators", collaboratorId);
    const docRef = doc(collabRef, tableName, docId);
    await deleteDoc(docRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
