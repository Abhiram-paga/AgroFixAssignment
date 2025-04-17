const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');

app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);

app.listen(5000, () => console.log("Server running on port 5000"));
