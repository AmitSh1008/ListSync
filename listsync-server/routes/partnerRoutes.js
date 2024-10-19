// routes/partnersRoutes.js
const express = require('express');
const { addPartner, getListPartners, getPartneredLists } = require('../controllers/partnerController');
const router = express.Router();

router.post('/', addPartner); // Add a partner to a list by email
router.get('/:listId', getListPartners); // Get all partners of a list
router.get('/lists/:userEmail', getPartneredLists); 

module.exports = router;