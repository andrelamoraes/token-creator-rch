import { Item } from '../../models/Item';

type Props = {
  item?: Item;
  onSubmit: (item: Omit<Item, 'id'>) => void;
};

export const ItemFormPresenter = ({ item, onSubmit }: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <input
        name="name"
        defaultValue={item?.name}
        placeholder="Name"
        className="block w-full p-2 border rounded"
      />
      <input
        name="description"
        defaultValue={item?.description}
        placeholder="Description"
        className="block w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {item ? 'Update' : 'Add'} Item
      </button>
    </form>
  );
};