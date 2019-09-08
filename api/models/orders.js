const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderNo: { type: String, required: true },
  orderOn: { type: Date, default: Date.now },
  details: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
      },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      discount: { type: Number },
      itemSubtotal: { type: Number },
      itemTax: { type: Number },
      itemAmount: { type: Number }
    }
  ],
  totalQuantity: { type: Number, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  subTotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: Number, default: 1 },
  // 1-active, 9-archived, 2-paid, 3-delivered
  createdOn: { type: Date, default: Date.now }
});

module.exports = Order = mongoose.model('order', orderSchema);
