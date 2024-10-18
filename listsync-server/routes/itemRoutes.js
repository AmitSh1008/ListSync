// routes/itemRoutes.js
const express = require('express');
const { createItem, updateItem, deleteItem, getListItems } = require('../controllers/itemController');
const router = express.Router();

router.post('/', createItem); // יצירת פריט חדש ברשימה
router.get('/list/:listId', getListItems); // קבלת כל הפריטים של רשימה
router.put('/:itemId', updateItem); // עדכון פריט ברשימה
router.delete('/:itemId', deleteItem); // מחיקת פריט

module.exports = router;