import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { register, login, updateProfile } from './controllers/authController.js';
import { getBlogs, createBlog, getBlog, updateBlog, deleteBlog } from './controllers/blogController.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8100'],
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Test profile route
app.get('/api/auth/profile/test', (req, res) => {
  res.json({ message: 'Profile route is working!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Auth routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.put('/api/auth/profile', protect, updateProfile);
app.get('/api/auth/profile', protect, (req, res) => {
  res.json({ message: 'Profile route accessible', user: req.user });
});

// Blog routes
app.get('/api/blogs', getBlogs);
app.post('/api/blogs', createBlog);
app.get('/api/blogs/:id', getBlog);
app.put('/api/blogs/:id', updateBlog);
app.delete('/api/blogs/:id', deleteBlog);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
