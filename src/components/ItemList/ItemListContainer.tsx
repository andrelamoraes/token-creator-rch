import { useItemStore } from '../../store/useItemStore';
import { ItemListPresenter } from './ItemListPresenter';

export const ItemListContainer = () => {
  const { items, deleteItem,updateItem } = useItemStore();
  
  return (
    <ItemListPresenter
      items={items}
      onDelete={deleteItem}
      onEdit={(id,item) => updateItem(id, item)}
    />
  );
};