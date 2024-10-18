// controllers/listController.js
const db = require('../config/db');

// Create a new list
const createList = async (req, res) => {
  const { user_id, name, description } = req.body;

  try {
    const newList = await db.query(
      'INSERT INTO lists (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [user_id, name, description]
    );

    res.status(201).json(newList.rows[0]);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// אחזור פרטי הרשימה לפי מזהה
const getListDetails = async (req, res) => {
    const { listId } = req.params;
    try {
      const list = await db.query('SELECT name, description FROM lists WHERE id = $1', [listId]);
      if (list.rows.length > 0) {
        console.log(list.rows[0]);
        res.json(list.rows[0]);
      } else {
        res.status(404).json({ message: 'List not found' });
      }
    } catch (error) {
      console.error('Error fetching list details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Get all lists for a user
const getUserLists = async (req, res) => {
  const { userId } = req.params;

  try {
    const userLists = await db.query('SELECT * FROM lists WHERE user_id = $1', [userId]);
    res.status(200).json(userLists.rows);
  } catch (error) {
    console.error('Error getting user lists:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a list
const updateList = async (req, res) => {
  const { listId } = req.params;
  const { name, description } = req.body;

  try {
    const updatedList = await db.query(
      'UPDATE lists SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, listId]
    );

    if (updatedList.rows.length === 0) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.status(200).json(updatedList.rows[0]);
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a list
const deleteList = async (req, res) => {
  const { listId } = req.params;

  try {
    const deletedList = await db.query('DELETE FROM lists WHERE id = $1 RETURNING *', [listId]);

    if (deletedList.rows.length === 0) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createList, getListDetails, getUserLists, updateList, deleteList };