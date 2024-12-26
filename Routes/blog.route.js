import { Router } from "express";
import { auth } from "../Middlewares/middlewares.js";
import {
  createBlog,
  getMyBlogs,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  deleteComment,
  getAllLikes,
 getAllComments
} from "../Controllers/blog.controller.js";

const router = Router();

router.post(`/create-blog`, auth, createBlog);
router.get(`/blogs`, auth, getMyBlogs);
router.get(`/blogs/:id`, auth, getUserBlogs);
router.put(`/update-blog/:id`, auth, updateBlog);
router.delete(`/delete-blog/:id`, auth, deleteBlog);
router.post(`/reaction/:id` , auth , toggleLike);
router.post(`/add-comment/:id` , auth , addComment);
router.delete(`/delete-comment/:id/:commentId` , auth , deleteComment);
router.get(`/likes/:id` , auth , getAllLikes)
router.get(`/comments/:id` , auth , getAllComments)


export default router;
