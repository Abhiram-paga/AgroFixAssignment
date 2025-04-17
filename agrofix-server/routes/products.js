const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { name, price } = req.body;
  await pool.query('INSERT INTO products (name, price) VALUES ($1, $2)', [name, price]);
  res.status(201).send('Product added');
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

module.exports = router;
