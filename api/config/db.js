const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // await mongoose.connect(config.mongoURI, {
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    //   useNewUrlParser: true
    // });
    await mongoose.connect(process.env.mongoURI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true
    });
    // mongoose.set('useCreateIndex', true);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // exit process with failuer
    process.exit(1);
  }
};

module.exports = connectDB;