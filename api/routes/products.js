const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../auth/auth');
const Product = require('../models/products');

router.get('/', async (req, res) => {
  try {
    const result = await Product.find().populate('vendor');
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

router.get('/:id', async (req, res) => {
  try {
    const result = await Product.find({ _id: req.params.id }).populate('vendor');
    res.status(200).json({
      count: result.length,
      result,
    })
  } catch (err) {
    console.error('product get by Id error: ', err);
    res.status(500).json({
      msg: 'Server Error',
      err,
    })
  }
  const id = req.params.id;
  res.status(200).json({
    message: 'handle get request',
    productId: id,
  });
});

router.post('/', [auth, [
  check('defaultName', 'Product Name is required').not().isEmpty(),
  check('package', 'Packaing info is required').not().isEmpty(),
  check('vendor', 'Vendor info is required').not().isEmpty(),
  check('price', 'Price is required').not().isEmpty().isNumeric({ min: 0.0 })
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {
    let { defaultName, defaultInfo, altName, altInfo, package, vendor, price, resellerPrice } = req.body;

    if (!altName) { altName = defaultName }
    if (defaultInfo && !altInfo) { altInfo = defaultInfo }
    if (!resellerPrice) { resellerPrice = price }

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

router.patch('/:id', auth, async (req, res) => {
  const { defaultName, price } = req.body;
  if (!(defaultName === undefined)) {
    if (defaultName.trim() === "") {
      return res.status(400).json({
        msg: 'Product Name is required'
      });
    }
  }
  if (!(price === undefined)) {
    if (price <= 0.00 || isNaN(price)) {
      return res.status(400).json({
        msg: 'Price must be greated than $0.00'
      });
    }
  }

  try {
    await Product.findOneAndUpdate({ _id: req.params.id }, req.body);

    res.status(201).json({
      msg: 'Product updated'
    });
  } catch (err) {
    console.error('product patch error: ', err);
    res.status(500).json({
      msg: 'Server Error',
      err,
    })
  }
});

router.delete('/:id', auth, async (req, res) => {
  res.status(200).json({
    message: 'handle delete request',
    productId: req.params.id,
  });
});

module.exports = router;