const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  defaultName: { type: String, required: true },
  defaultInfo: String,
  altName: String,
  altInfo: String,
  package: { type: String, required: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
    required: true,
  },
  price: { type: Number, required: true },
  resellerPrice: Number,
  images: [String],
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: "post", }],
  likes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', } }],
  dislikes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', } }],
  status: { type: Number, default: 1, },
  createdOn: { type: Date, default: Date.now, },
})

module.exports = Product = mongoose.model('product', productSchema);
