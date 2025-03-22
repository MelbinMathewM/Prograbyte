import { Router } from 'express';
import categoryRoutes from './categoryRoutes';
import courseRoutes from './courseRoutes';
import topicRoutes from './topicRoutes';
import wishlistRoutes from './wishlistRoutes';
import enrollmentRoutes from './enrolledCourseRoutes';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);
router.use('/topics', topicRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/enroll', enrollmentRoutes);

export default router;
