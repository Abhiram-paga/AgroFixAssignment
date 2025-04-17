const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ Buyer: Place Order
router.post('/', async (req, res) => {
  try {
    const {
      buyer_name,
      buyer_contact,
      delivery_address,
      items,
      status = 'Pending'
    } = req.body;

    const result = await pool.query(
      `INSERT INTO orders (buyer_name, buyer_contact, delivery_address, items, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [buyer_name, buyer_contact, delivery_address, JSON.stringify(items), status]
    );

    const orderId = result.rows[0].id;
    res.status(201).json({ message: 'Order placed successfully!', orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// ✅ Buyer: Track Order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving order' });
  }
});

// ✅ Admin: Get All Orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ✅ Admin: Update Order Status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
