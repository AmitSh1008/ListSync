// routes/listRoutes.js
const express = require('express');
const { createList, getListDetails, getUserLists, updateList, deleteList } = require('../controllers/listController');
const router = express.Router();

router.post('/', createList); // יצירת רשימה חדשה
router.get('/user/:userId', getUserLists); // קבלת כל הרשימות של משתמש מסוים
router.get('/:listId', getListDetails);
router.put('/:listId', updateList); // עדכון רשימה קיימת
router.delete('/:listId', deleteList); // מחיקת רשימה

module.exports = router;