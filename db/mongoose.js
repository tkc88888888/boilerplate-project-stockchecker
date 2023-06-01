require("dotenv").config();
let mongodb = require('mongodb');
let mongoose = require('mongoose');

async function connectDB(callback) {
  try {
    // Connect to MongoDB
    mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");

    // Define your Mongoose models and schemas here
    const stockSchema = new mongoose.Schema({
      stock: {
        type: String,
        require: true,
        trim: true,
        uppercase: true
      },
      price: {
        type: Number,
        require: true
      },
      likedby: {
        type: [String],
        required: true,
        validate: {
          validator: function(ips) {
            // Custom validation logic for IP strings
            // For example, you can validate the IP format using regular expressions
            return ips.every(ip => /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(ip));
          },
          message: 'Invalid IP format'
        }
      }
    });
    const stock = mongoose.model("Stock", stockSchema);

    // Make the appropriate DB calls
    await callback(stock);

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;