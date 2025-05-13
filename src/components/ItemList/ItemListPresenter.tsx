import { Item } from '../../models/Item';

type Props = {
  items: Item[];
  onEdit: (id: number, item : Item) => void;
  onDelete: (id: number) => void;
};

export const ItemListPresenter = ({ items, onEdit, onDelete }: Props) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.id} className="p-4 border rounded flex justify-between">
        <div>
          <h3 className="font-bold">{item.name}</h3>
          <p>{item.description}</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => onEdit(item.id, item)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);