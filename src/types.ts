export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  updatedAt: number;
};

export type NewInventoryItem = Omit<InventoryItem, 'id' | 'updatedAt'>;
