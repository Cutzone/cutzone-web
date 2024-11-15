import firebaseApp from "@/config/firebase";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

import { PlanEntity } from "@/common/entities/plan";

const db = getFirestore(firebaseApp);
const tableName = "products";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getActivePrice = async (id: string): Promise<any> => {
  const docRef = collection(db, "products", id, "prices");
  const q = query(docRef);
  const querySnapshot = await getDocs(q);

  const priceData = querySnapshot.docs[0].data();
  return { ...priceData, id: querySnapshot.docs[0].id };
};
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, tableName);
    const q = query(productsRef);
    const querySnapshot = await getDocs(q);
    const product: PlanEntity[] = [];

    for (const doc of querySnapshot.docs) {
      const priceDoc = await getActivePrice(doc.id);
      product.push({
        id: doc.id,
        ...doc.data(),
        price: priceDoc.unit_amount / 100,
        priceId: priceDoc.id,
        benefits: doc.data().metadata.benefits
          ? doc.data().metadata.benefits?.split("||")
          : []
      } as PlanEntity);
    }

    return product;
  } catch (error) {
    console.log(error);
    return [];
  }
};
