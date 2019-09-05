const express = require('express');
const morgan = require('morgan');

const connectDB = require('./api/config/db');

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
app.use('/auth', require('./api/routes/auth'))
app.use('/users', require('./api/routes/users'));
app.use('/vendors', require('./api/routes/vendors'));
app.use('/products', require('./api/routes/products'));
app.use('/orders', require('./api/routes/orders'));

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