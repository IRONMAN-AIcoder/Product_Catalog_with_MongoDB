// 1. Import Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // This line loads the .env file

// 2. Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors()); // Allows the frontend to communicate with the backend
app.use(express.json()); // Allows the server to understand JSON data

// 4. Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB!'))
.catch(err => console.error('MongoDB connection error:', err));

// 5. Define the Product Schema and Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

// --- API ROUTES ---

// 6. Simple Login Route (No database, just for role-playing)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    return res.json({ success: true, role: 'admin', message: 'Admin login successful' });
  }
  if (username === 'user' && password === 'user123') {
    return res.json({ success: true, role: 'user', message: 'User login successful' });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// 7. GET all products (Publicly accessible)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// 8. POST a new product (Admin only - we trust the frontend for now)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
});

// 9. PUT/Update a product (Admin only)
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
});

// 10. DELETE a product (Admin only)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});


// 11. Start the Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

