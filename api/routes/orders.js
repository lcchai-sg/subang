const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handle get request'
  });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({
    message: 'handle get request',
    orderId: id,
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'handle post request',
    params: req.body,
  });
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
    orderId: req.params.id,
  });
});

module.exports = router;