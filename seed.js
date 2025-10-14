const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

// Define the same schema as in your server.js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

const seedProducts = [
    { name: "Smart Watch", category: "Electronics", brand: "Fossil", price: 6999, rating: 4.8 },
    { name: "Wireless Headphones", category: "Electronics", brand: "Sony", price: 2999, rating: 4.6 },
    { name: "Running Shoes", category: "Footwear", brand: "Nike", price: 7999, rating: 4.2 },
    { name: "Leather Backpack", category: "Fashion", brand: "H&M", price: 3499, rating: 4.5 },
    { name: "Gaming Mouse", category: "Electronics", brand: "Logitech", price: 4500, rating: 4.9 },
    { name: "Yoga Mat", category: "Fitness", brand: "Lululemon", price: 5200, rating: 4.7 },
    { name: "Classic Sneakers", category: "Footwear", brand: "Adidas", price: 6500, rating: 4.4 },
    { name: "Denim Jacket", category: "Fashion", brand: "Levi's", price: 8999, rating: 4.3 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    // Insert new products
    await Product.insertMany(seedProducts);
    console.log('Database has been successfully seeded!');

  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Run the seeder function
seedDB();
