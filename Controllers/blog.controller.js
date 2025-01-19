import Blog_Model from "../Models/blog.model.js";
import Follow_Model from "../Models/follow.model.js";
import cloudinary from "../Config/cloudinary.js";
import mongoose from "mongoose";
export const createBlog = async (req, res) => {
  try {
    let image = null;
    let result = null;
    const { title, content, tags } = req.body;
    image = req.files?.image;
    const { _id } = req.user;
    const authorId = new mongoose.Types.ObjectId(_id);
    if (image)
      result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: `Blogs_Images`,
      });
    const data = await Blog_Model.create({
      title,
      content,
      tags,
      imageDetails: {
        imageURL: result?.secure_url,
        imageId: result?.public_id,
      },
      author: authorId,
    });
    return res.status(201).json({ message: `Post uploaded`, success: true });
  } catch (error) {
    console.log(`Error at createBlog: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const getMyBlogs = async (req, res) => {
  try {
    const { _id } = req.user;
    const authorId = new mongoose.Types.ObjectId(_id);
    const blogs = await Blog_Model.find({ author: authorId });
    if (blogs.length === 0)
      return res
        .status(404)
        .json({ message: "No blogs found", success: false });
    return res.status(200).json({ blogs, success: true });
  } catch (error) {
    console.log(`Error at getMyBlogs: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const getUserBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = new mongoose.Types.ObjectId(id);
    const blogs = await Blog_Model.find({ author: id }).populate("author", "name imageDetails") ;
    if (blogs.length === 0)
      return res
        .status(404)
        .json({ message: "No blogs found", success: true });
    return res.status(200).json({ blogs, success: true });
  } catch (error) {
    console.log(`Error at getUserBlogs: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    let imageUrl = null;

    const existingBlog = await Blog_Model.findById(id);
    if (!existingBlog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }

    if (req.files && req.files.image) {
      const image = req.files.image;

      if (existingBlog.image) {
        const oldImageId = existingBlog.imageDetails.imageId;
        await cloudinary.uploader.destroy(oldImageId);
      }

      const result = await cloudinary.uploader.upload(image.tempFilePath);

      imageUrl = result.secure_url; // Cloudinary image URL
    } else {
      imageUrl = existingBlog.imageDetails.imageURL;
    }

    existingBlog.title = title;
    existingBlog.content = content;
    existingBlog.tags = tags;
    existingBlog.imageDetails.imageURL = imageUrl; // Update the image URL

    await existingBlog.save(); // Save the updated blog

    return res
      .status(200)
      .json({ message: "Blog updated successfully", success: true });
  } catch (error) {
    console.log("Error at updateBlog:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const objID = new mongoose.Types.ObjectId(id);
    const existingBlog = await Blog_Model.findByIdAndDelete(objID);
    if (!existingBlog) {
      return res
        .status(404)
        .json({ message: `Blog not found`, success: false });
    }
    if (existingBlog.imageDetails.imageId) {
      await cloudinary.uploader.destroy(existingBlog.imageDetails.imageId);
    }

    return res
      .status(200)
      .json({ message: `Blog deleted successfully`, success: true });
  } catch (error) {
    console.log(`Error at deleteBlog: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Internal Server Error`, success: false });
  }
};
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const blog = await Blog_Model.findById(id);

    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }

    const alreadyLiked = blog.likes.includes(_id);

    if (alreadyLiked) {
      blog.likes.pull(_id);

      await blog.save();

      return res.status(200).json({
        message: "Blog unliked successfully",
        success: true,
        blog,
      });
    } else {
      blog.likes.addToSet(_id);
      await blog.save();
      return res.status(200).json({
        message: "Blog liked successfully",
        success: true,
        blog,
      });
    }
  } catch (error) {
    console.log("Error in toggleLike: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const { text } = req.body;
    const blog = await Blog_Model.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ message: `Blog not found`, success: false });
    }
    blog.comments.push({ user: _id, text });
    await blog.save();
    return res.status(201).json({ message: `Comment added`, success: true });
  } catch (error) {
    console.log("Error in addComment: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const blog = await Blog_Model.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ message: `Blog not found`, success: false });
    }
    const isExist = blog.comments.find((comment) => comment._id == commentId);
    if (!isExist) {
      return res
        .status(404)
        .json({ message: `Comment did not found`, success: false });
    }
    blog.comments.pull({ _id: commentId });
    await blog.save();
    return res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in deleteComment: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const getAllLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog_Model.findById(id).populate({
      path: `likes`,
      select: `name`,
    });
    if (!blog) {
      return res
        .status(404)
        .json({ message: `Blog not found`, success: false });
    }
    return res.status(200).json({ likes: blog.likes, success: true });
  } catch (error) {
    console.log("Error in getAllLikes: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const getAllComments = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog_Model.findById(id).populate({
      path: `comments.user`,
      select: `name`,
    });
    if (!blog) {
      return res
        .status(404)
        .json({ message: `Blog not found`, success: false });
    }
    return res.status(200).json({ comments: blog.comments, success: true });
  } catch (error) {
    console.log("Error in getAllComments: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res
        .status(400)
        .json({ message: "Invalid/missing token", success: false });
    }

    const followersData = await Follow_Model.findOne(
      { user: _id },
      { following: 1, _id: 0 }
    );

    if (!followersData || followersData.following.length === 0) {
      return res
        .status(200)
        .json({ message: "No followers found", followers: [], success: true });
    }

    const posts = await Promise.all(
      followersData.following.map(async (followerId) => {
       
        const followerPosts = await Blog_Model.find({
          author: new mongoose.Types.ObjectId(followerId),
        })
          .populate("author", "name imageDetails") 
          .sort({ createdAt: -1 });
        return followerPosts;
      })
    );
    const flattenedPosts = posts.flat();

    return res
      .status(200)
      .json({ message: "Posts found", data: flattenedPosts, success: true });
  } catch (error) {
    console.log("Error in getAllPosts: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
