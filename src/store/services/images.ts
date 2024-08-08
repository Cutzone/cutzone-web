import { ImagesEntity } from "@/common/entities/images";
import firebaseApp from "@/config/firebase";
import {
  DocumentData,
  collection,
  deleteDoc,
  addDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  orderBy
} from "firebase/firestore";

const db = getFirestore(firebaseApp);
const tableName = "images";

export const createNewImageDoc = async (url: string, barberShopId: string) => {
  try {
    const barberShopRef = doc(db, "companies", barberShopId);
    const imagesCollectionRef = collection(barberShopRef, tableName);

    await addDoc(imagesCollectionRef, {
      url
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
