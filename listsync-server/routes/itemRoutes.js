// routes/itemRoutes.js
const express = require('express');
const { createItem, patchItem, deleteItem, getListItems, addPartner, getListPartners } = require('../controllers/itemController');
const router = express.Router();

router.post('/', createItem); // יצירת פריט חדש ברשימה
router.get('/list/:listId', getListItems); // קבלת כל הפריטים של רשימה
router.patch('/:itemId', patchItem); // עדכון פריט קיים (עדכון חלקי)
router.delete('/:itemId', deleteItem); // מחיקת פריט

module.exports = router;