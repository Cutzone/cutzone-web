import firebaseApp from "@/config/firebase";
import { collection, addDoc, doc, getFirestore } from "firebase/firestore";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message };
  }
};
