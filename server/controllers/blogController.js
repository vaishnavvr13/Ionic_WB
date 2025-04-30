import Blog from "../models/Blog.js";

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
};

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    let blog = await Blog.create({
      title,
      content,
      image
    });

    // Return the created blog
    res.status(201).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating blog", error: error.message });
  }
};

// Get single blog
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blog", error: error.message });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update blog fields
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.image = req.body.image || "";
    
    // Save and get the updated blog
    const updatedBlog = await blog.save();
    
    // Send the complete updated blog
    res.json({
      _id: updatedBlog._id,
      title: updatedBlog.title,
      content: updatedBlog.content,
      image: updatedBlog.image,
      createdAt: updatedBlog.createdAt,
      updatedAt: updatedBlog.updatedAt
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting blog", error: error.message });
  }
};
