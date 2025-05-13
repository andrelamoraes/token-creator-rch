import { useState } from 'react';
import { ItemFormPresenter } from './ItemFormPresenter';
import { useItemStore } from '../../store/useItemStore';
import { Item } from '../../models/Item';

export const ItemFormContainer = () => {
  const { addItem, updateItem, items } = useItemStore();
  const [editingItem, setEditingItem] = useState<number | null>(null);

  const handleSubmit = (item: Omit<Item, 'id'>) => {
    if (editingItem !== null) {
      updateItem(editingItem, item);
      setEditingItem(null);
    } else {
      addItem(item);
    }
  };

  return <ItemFormPresenter 
    onSubmit={handleSubmit} 
    item={items.find(i => i.id === editingItem)}
  />;
};