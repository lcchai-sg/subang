const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
  defaultName: String,
  defaultInfo: String,
  altName: String,
  altInfo: String,
  address: String,
  city: String,
  state: String,
  postal: String,
  country: String,
  email: String,
  website: String,
  phone: String,
  logo: String,
  status: {
    type: Number,
    default: 1,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Vendor = mongoose.model('Vendor', vendorSchema);
