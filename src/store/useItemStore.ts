import { create } from 'zustand';
import { Item } from '../models/Item';

interface ItemStore { 
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: number, updatedItem: Partial<Item>) => void;
  deleteItem: (id: number) => void;
}

let nextId = 1;

export const useItemStore = create<ItemStore>((set) => ({
  items: [],
  addItem: (item) => 
    set((state) => ({ items: [...state.items, { ...item, id: nextId++ }] })),
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));