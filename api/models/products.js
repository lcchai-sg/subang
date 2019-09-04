const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  defaultName: String,
  defaultInfo: String,
  altName: String,
  altInfo: String,
  package: String,
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
  },
  price: Number,
  resellerPrice: Number,
  images: [String],
  post: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  }],
  dislikes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  }],
  status: {
    type: Number,
    default: 1,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Product = mongoose.model('Product', productSchema);
