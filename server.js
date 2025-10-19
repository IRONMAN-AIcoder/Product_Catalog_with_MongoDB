const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'public')));
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// --- DATABASE CONNECTION ---
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- MONGOOSE SCHEMAS ---
const productSchema = new mongoose.Schema({ name: { type: String, required: true, index: true }, brand: { type: String, required: true }, category: { type: String, required: true, index: true }, price: { type: Number, required: true }, mrp: { type: Number, required: true }, rating: { type: Number, required: true, min: 0, max: 5 }, ratingsCount: { type: String, required: true }, boughtInPastMonth: { type: String, required: true }, description: { type: String, required: true }, warranty: { type: String, required: true }, returnPolicy: { type: String, required: true }, imageUrl: { type: String, default: '' } });
const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({ email: { type: String, required: true, unique: true, lowercase: true, index: true }, password: { type: String, required: true }, role: { type: String, enum: ['user', 'admin'], default: 'user' } });
const User = mongoose.model('User', userSchema);

// --- FILE UPLOADS: MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`); }
});
const upload = multer({ storage: storage });

// --- API ROUTES ---

// --- AUTHENTICATION ROUTES ---
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, role, adminKey } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Email, password, and role are required.' });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with this email already exists.' });
        }
        
        // If signing up as admin, validate the secret key from environment variables
        if (role === 'admin') {
            // This now does a direct string comparison. No hashing.
            if (!adminKey || adminKey !== "Aquila123") {
                return res.status(403).json({ success: false, message: 'Invalid Admin secret Key.' });
            }
        }
        
        // User passwords are still securely hashed
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        
        res.status(201).json({ success: true, message: 'User created successfully! Please log in.' });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Server error during signup.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Securely compares the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        res.json({ success: true, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error during login.');
    }
});


// --- PRODUCT API ROUTES (No changes) ---
app.get('/api/products', async (req, res) => { try { const { page = 1, limit = 8, search = '', category = 'All', sort = 'newest', minPrice, maxPrice } = req.query; let query = {}; if (search) { query.name = { $regex: search, $options: 'i' }; } if (category && category !== 'All') { query.category = category; } if (minPrice || maxPrice) { query.price = {}; if (minPrice) { query.price.$gte = parseInt(minPrice, 10); } if (maxPrice) { query.price.$lte = parseInt(maxPrice, 10); } } let sortOption = {}; switch (sort) { case 'price-asc': sortOption = { price: 1 }; break; case 'price-desc': sortOption = { price: -1 }; break; case 'rating': sortOption = { rating: -1 }; break; default: sortOption = { _id: -1 }; } const products = await Product.find(query).sort(sortOption).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)); const totalProducts = await Product.countDocuments(query); const totalPages = Math.ceil(totalProducts / parseInt(limit)); res.json({ products, totalPages, currentPage: parseInt(page) }); } catch (error) { res.status(500).send('Server error fetching products.'); } });
app.get('/api/products/:id', async (req, res) => { try { const product = await Product.findById(req.params.id); if (!product) { return res.status(404).json({ message: 'Product not found' }); } res.json(product); } catch (error) { res.status(500).send('Server error fetching product details.'); } });
app.post('/api/products', upload.single('image'), async (req, res) => { try { const { name, price, brand, category } = req.body; if (!name || !price || !brand || !category) { return res.status(400).json({ message: 'Missing required fields.' }); } const newProduct = new Product({ ...req.body, imageUrl: req.file ? req.file.path.replace(/\\/g, "/") : '' }); await newProduct.save(); res.status(201).json(newProduct); } catch (error) { res.status(500).send('Server error creating product.'); } });
app.put('/api/products/:id', upload.single('image'), async (req, res) => { try { const { name, price, brand, category } = req.body; if (!name || !price || !brand || !category) { return res.status(400).json({ message: 'Missing required fields.' }); } let updateData = { ...req.body }; if (req.file) { updateData.imageUrl = req.file.path.replace(/\\/g, "/"); } const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }); if (!updatedProduct) { return res.status(404).json({ message: 'Product not found' }); } res.json(updatedProduct); } catch (error) { res.status(500).send('Server error updating product.'); } });
app.delete('/api/products/:id', async (req, res) => { try { const deletedProduct = await Product.findByIdAndDelete(req.params.id); if (!deletedProduct) { return res.status(404).json({ message: 'Product not found' }); } if (deletedProduct.imageUrl) { fs.unlink(path.join(__dirname, deletedProduct.imageUrl), err => { if (err) console.error("Error deleting image file:", err); }); } res.json({ message: 'Product deleted successfully' }); } catch (error) { res.status(500).send('Server error deleting product.'); } });

// --- START SERVER ---
app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});

