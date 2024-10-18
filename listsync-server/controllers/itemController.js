// controllers/itemController.js
const db = require('../config/db');

// Create a new item in a list
const createItem = async (req, res) => {
  const { list_id, name, quantity, status } = req.body;

  try {
    const newItem = await db.query(
      'INSERT INTO items (list_id, name, quantity, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [list_id, name, quantity || 1, status || false]
    );

    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all items in a list
const getListItems = async (req, res) => {
    const { listId } = req.params;
  
    try {
      const listItems = await db.query('SELECT * FROM items WHERE list_id = $1', [listId]);
      res.status(200).json(listItems.rows);
    } catch (error) {
      console.error('Error getting list items:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Update an item in a list
const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { name, quantity, status } = req.body;

  try {
    const updatedItem = await db.query(
      'UPDATE items SET name = $1, quantity = $2, status = $3 WHERE id = $4 RETURNING *',
      [name, quantity, status, itemId]
    );

    if (updatedItem.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem.rows[0]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an item from a list
const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const deletedItem = await db.query('DELETE FROM items WHERE id = $1 RETURNING *', [itemId]);

    if (deletedItem.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createItem, updateItem, deleteItem, getListItems };