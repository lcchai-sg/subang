const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../auth/auth');
const Vendor = require('../models/vendors');

router.get('/', async (req, res) => {
  try {
    const result = await Vendor.find();
    res.status(200).json({
      count: result.length,
      result
    });
  } catch (err) {
    console.error('vendors get error: ', err);
    res.status(500).json({
      msg: 'Server Error',
      err
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await Vendor.find({ _id: req.params.id });
    if (result.length > 0) {
      res.status(200).json({
        count: result.length,
        result
      });
    } else {
      res.status(404).json({
        msg: 'No data found'
      });
    }
  } catch (err) {
    console.error('vendors get error: ', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'No data found'
      });
    }
    res.status(500).json({
      msg: 'Server Error',
      err
    });
  }
});

router.post(
  '/',
  [
    auth,
    [
      check('defaultName', 'Vendor Name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      let {
        defaultName,
        defaultInfo,
        altName,
        altInfo,
        address,
        city,
        state,
        postal,
        country,
        email,
        website,
        phone
      } = req.body;

      if (!altName) {
        altName = defaultName;
      }
      if (defaultInfo && !altInfo) {
        altInfo = defaultInfo;
      }
      if (!country) {
        country = process.env.Country;
      }

      const vendor = new Vendor({
        defaultName,
        defaultInfo,
        altName,
        altInfo,
        address,
        city,
        state,
        postal,
        country,
        email,
        website,
        phone
      });

      await vendor.save();
      res.status(201).json({
        message: 'New Vendor Created',
        vendor
      });
    } catch (err) {
      console.error('vendor create error: ', err);
      res.status(500).json({
        msg: 'Server Error',
        err
      });
    }
  }
);

router.patch('/:id', auth, async (req, res) => {
  try {
    await Vendor.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.status(200).json({
      msg: 'Vendor Updated'
    });
  } catch (err) {
    console.error('vendor patch error: ', err);
    res.status(500).json({
      msg: 'Server Error',
      err
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let vendor = await Vendor.find({ _id: req.params.id });
    if (vendor.length <= 0) {
      return res.status(404).json({
        msg: 'No data found'
      });
    }
    // check if being used
    let result = await Product.find({ vendor: req.params.id });
    if (result.length > 0) {
      // being used
      // archive vendor data to status 9
      vendor.status = 9;
      await vendor.save();
      return res.status(201).json({
        msg: 'Vendor Archived'
      });
    }
    // no related data, delete vendor
    await Vendor.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({
      msg: 'Vendor Deleted'
    });
  } catch (err) {
    console.error('vendor delete error: ', err);
    res.status(500).json({
      msg: 'Server Error',
      err
    });
  }
});

module.exports = router;
