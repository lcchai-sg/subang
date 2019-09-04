const express = require('express');
const router = express.Router();

const Product = require('../models/products');

router.get('/', async (req, res, next) => {
  try {
    const result = await Product.find();
    res.status(200).json({
      count: result.length,
      result,
    })
  } catch (err) {
    console.error('products get error: ', err);
    res.status(500).json({
      msg: 'Server Error',
      err,
    })
  }
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({
    message: 'handle get request',
    productId: id,
  });
});

router.post('/', async (req, res, next) => {
  try {
    const { defaultName, defaultInfo, altName, altInfo, package, vendor, price, resellerPrice } = req.body;
    const product = new Product({
      defaultName,
      defaultInfo,
      altName,
      altInfo,
      package,
      vendor,
      price,
      resellerPrice
    });

    await product.save();
    res.status(201).json({
      message: 'New Product Created',
      product,
    });
  } catch (err) {
    console.error('products get error: ', err);
    res.status(500).json({
      msg: 'Server Error',
      err,
    })
  }
});

router.patch('/', (req, res, next) => {
  res.status(201).json({
    message: 'handle post request',
    params: req.body,
  });
});

router.delete('/:id', (req, res, next) => {
  res.status(200).json({
    message: 'handle delete request',
    productId: req.params.id,
  });
});

module.exports = router;