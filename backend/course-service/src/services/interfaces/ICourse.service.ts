import { ICoupon } from "@/models/coupon.model";
import { ICourse } from "@/models/course.model";
import { IOffer } from "@/models/offer.model";
import { IRating } from "@/models/rating.model";

export interface ICourseService {
    createCourse(course: ICourse): Promise<ICourse>;
    updateCourse(courseId: string, courseData: Partial<ICourse>): Promise<ICourse | null>;
    deleteCourse(courseId: string): Promise<void>;
    getCourses(filters: object, sort: string): Promise<ICourse[]>;
    getCourseDetail(id: string): Promise<ICourse | null>;
    changeCourseStatus(courseId: string, status: string): Promise<void>;

    addRating(userId: string, courseId: string, rating: number, review: string): Promise<void>;
    getRatings(courseId: string): Promise<IRating | null>;

    getCoupons(): Promise<ICoupon[] | null>;
    postCoupon(code: string, discount: number, isLiveStream: boolean): Promise<ICoupon>;
    applyCoupon(code: string, userId: string): Promise<ICoupon>;
    editCoupon(couponId: string, updateData: Partial<ICoupon>): Promise<ICoupon | null>;
    deleteCoupon(couponId: string): Promise<void>;
    addUserToCouponUser(code: string, userId: string): Promise<void>;
    
    getOffers(): Promise<IOffer[] | null>;
    postOffer(title: string, description: string, discount: number, expiryDate: string): Promise<IOffer>;
    applyOfferToCourse(courseId: string, offerId: string): Promise<void>;
    removeOfferFromCourse(courseId: string): Promise<void>;
    editOffer(offerId: string, updateData: Partial<IOffer>): Promise<void>;
    deleteOffer(offerId: string): Promise<void>;
}
