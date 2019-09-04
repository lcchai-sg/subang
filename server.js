const express = require('express');
const morgan = require('morgan');

const connectDB = require('./api/config/db');
const vendorRoutes = require('./api/routes/vendors');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// routes
app.use('/vendors', vendorRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// no routes to handle request
app.use((req, res, next) => {
  const error = new Error('Route Not Found');
  error.status = 404;
  next(error);
});

// handle all errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));