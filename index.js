const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
let cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 3000;

// MongoDB Model
const BlogPost = mongoose.model('BlogPost', new mongoose.Schema({
  title: String,
  description: String
}));

// Middleware
app.use(bodyParser.json());

// Routes
// Create a new blog post
app.post('/blog', async (req, res) => {
  try {
    const { title, description } = req.body;
    const blogPost = await BlogPost.create({ title, description });
    res.status(201).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Get all blog posts
app.get('/blog', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});





// Update a blog post by ID
app.put('/blog/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    if (!updatedBlogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.status(200).json(updatedBlogPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete a blog post by ID
app.delete('/blog/:id', async (req, res) => {
  try {
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');

  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});
