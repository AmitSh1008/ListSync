import React, { useState, useEffect } from 'react';
import { getListItems, createItem, patchItem, deleteItem } from '../api';

const Items = ({ token, listId }) => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');

  // Fetch list items when component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getListItems(listId, token);
        setItems(response);
      } catch (error) {
        alert('Error fetching items');
      }
    };

    if (token) {
      fetchItems();
    }
  }, [token, listId]);

  // Handle creating a new item
  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const newItem = await createItem({ list_id: listId, name: itemName }, token);
      setItems([...items, newItem]);
      setItemName('');
    } catch (error) {
      alert('Error creating item');
    }
  };

  // Handle updating an item partially
  const handlePatchItem = async (itemId, field, value) => {
    try {
      const updatedData = { [field]: value };
      const updatedItem = await patchItem(itemId, updatedData, token);
      setItems(items.map((item) => (item.id === itemId ? updatedItem : item)));
    } catch (error) {
      alert('Error updating item');
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId, token);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      alert('Error deleting item');
    }
  };

  // Toggle item status
  const toggleItemStatus = async (item) => {
    await handlePatchItem(item.id, 'status', !item.status);
  };

  return (
    <div>
      <h2>Items in List</h2>
      <form onSubmit={handleCreateItem}>
        <input
          type="text"
          placeholder="New Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span style={{ textDecoration: item.status ? 'line-through' : 'none' }}>
              {item.name}
            </span>
            <button onClick={() => toggleItemStatus(item)}>
              {item.status ? 'Unmark' : 'Mark as Done'}
            </button>
            <button
              onClick={() =>
                handlePatchItem(item.id, 'name', prompt('Update item name', item.name) || item.name)
              }
            >
              Edit Name
            </button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;
