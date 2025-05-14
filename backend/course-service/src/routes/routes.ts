import { Router } from 'express';
import categoryRoutes from './category.route';
import courseRoutes from './course.route';
import topicRoutes from './topic-route';
import wishlistRoutes from './wishlist.route';
import enrollmentRoutes from './enrolled-course.route';
import liveRouter from './live.route';
import couponRouter from './coupon.route';
import offerRouter from './offer.route';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/coupons', couponRouter);
router.use('/offers', offerRouter);
router.use('/courses', courseRoutes);
router.use('/topics', topicRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/enroll', enrollmentRoutes);
router.use('/live', liveRouter);

export default router;
