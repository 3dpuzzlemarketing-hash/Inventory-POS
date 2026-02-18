import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore';

import { db } from '../firebase';
import { InventoryItem, NewInventoryItem } from '../types';

const inventoryCollection = collection(db, 'inventory');

export const listInventory = async (): Promise<InventoryItem[]> => {
  const snapshot = await getDocs(query(inventoryCollection, orderBy('updatedAt', 'desc')));

  return snapshot.docs.map((entry) => {
    const data = entry.data() as Omit<InventoryItem, 'id'>;
    return {
      id: entry.id,
      ...data
    };
  });
};

export const createInventoryItem = async (item: NewInventoryItem): Promise<void> => {
  await addDoc(inventoryCollection, {
    ...item,
    updatedAt: Date.now()
  });
};

export const updateInventoryItem = async (id: string, item: NewInventoryItem): Promise<void> => {
  await updateDoc(doc(db, 'inventory', id), {
    ...item,
    updatedAt: Date.now()
  });
};

export const removeInventoryItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'inventory', id));
};
