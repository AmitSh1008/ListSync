// controllers/partnersController.js
const db = require('../config/db');
const { notifyOwnerAndPartners } = require('../websocketHandler');

// Add a partner to a list by email
const addPartner = async (req, res) => {
  const { list_id, partner_email } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO list_partners (list_id, partner_email) VALUES ($1, $2) RETURNING *',
      [list_id, partner_email]
    );
    res.status(201).json(result.rows[0]);
    notifyOwnerAndPartners(list_id, 'partner_added');
  } catch (error) {
    console.error('Error adding partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all partners of a list by list ID
const getListPartners = async (req, res) => {
  const { listId } = req.params;

  try {
    const result = await db.query('SELECT partner_email FROM list_partners WHERE list_id = $1', [listId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all lists where the user is a partner
const getPartneredLists = async (req, res) => {
    const { userEmail } = req.params; // or req.query if you prefer
  
    try {
      const result = await db.query(`
        SELECT l.* FROM lists l
        JOIN list_partners lp ON l.id = lp.list_id
        WHERE lp.partner_email = $1
      `, [userEmail]);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching partnered lists:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = { addPartner, getListPartners, getPartneredLists  };