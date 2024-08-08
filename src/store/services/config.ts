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
import { ConfigEntity } from "@/common/entities/config";

const db = getFirestore(firebaseApp);
const tableName = "config";

export const createConfigDoc = async ({
  id,
  corte,
  barba,
  sobrancelha
}: ConfigEntity) => {
  try {
    await setDoc(doc(db, "config", id || ""), {
      id,
      corte,
      barba,
      sobrancelha
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getConfig = async (id: string) => {
  return new Promise<DocumentData | null>((resolve, reject) => {
    const docRef = doc(db, tableName, id);
    getDoc(docRef)
      .then((data) => {
        const configData = data.data();
        resolve(configData || null);
      })
      .catch((error) => reject(error));
  });
};

export const getAllConfigs = async () => {
  const configRef = collection(db, tableName);
  const q = query(configRef);
  const querySnapshot = await getDocs(q);
  const configs: ConfigEntity[] = [];
  querySnapshot.forEach((doc) => {
    configs.push({ id: doc.id, ...doc.data() } as ConfigEntity);
  });
  return configs;
};

export const updateConfig = async (data: Partial<ConfigEntity>) => {
  try {
    const docRef = doc(db, tableName, data.id || "");
    await updateDoc(docRef, data);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
