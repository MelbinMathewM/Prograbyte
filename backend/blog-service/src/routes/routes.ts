import { Router } from "express";
import postRouter from "@/routes/post.route";
import blogProfileRouter from "@/routes/blog-profile.route";

const router = Router();

router.use('/post',postRouter);
router.use('/blog-profile',blogProfileRouter)

export default router;