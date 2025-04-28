import { inject, injectable } from "inversify";
import { ICourseRepository } from "@/repositories/interfaces/ICourse.repository";
import { ICourse } from "@/models/course.model";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { deleteFromCloudinary, extractCloudinaryDetails } from "@/utils/cloudinary.util";
import { TopicService } from "./topic.service";
import { ICourseService } from "../interfaces/ICourse.service";
import { IRatingRepository } from "@/repositories/interfaces/IRating.repository";
import { convertToObjectId } from "@/utils/convert-objectid.util";
import { IRating } from "@/models/rating.model";
import { ICouponRepository } from "@/repositories/interfaces/ICoupon.repository";
import { IOfferRepository } from "@/repositories/interfaces/IOffer.repository";
import { ICoupon } from "@/models/coupon.model";
import { IOffer } from "@/models/offer.model";


@injectable()
export class CourseService implements ICourseService {
    constructor(
        @inject("ICourseRepository") private _courseRepository: ICourseRepository,
        @inject("IRatingRepository") private _ratingRepository: IRatingRepository,
        @inject("ICouponRepository") private _couponRepository: ICouponRepository,
        @inject("IOfferRepository") private _offerRepository: IOfferRepository,
        @inject(TopicService) private _topicService: TopicService
    ) { }


    async createCourse(course: ICourse): Promise<ICourse> {

        const price = Number(course.price);

        const newCourseData = {
            title: course.title,
            description: course.description,
            category_id: course.category_id,
            tutor_id: course.tutor_id,
            price,
            preview_video_urls: course?.preview_video_urls,
            poster_url: course.poster_url,
        };

        const newCourse = await this._courseRepository.create(newCourseData as ICourse);

        return newCourse
    }

    async changeCourseStatus(courseId: string, status: string): Promise<void> {
        await this._courseRepository.changeCourseStatus(courseId, status);
    }

    async getCourses(filters: object, sort: string): Promise<ICourse[]> {
        return await this._courseRepository.getFilteredCourses(filters, sort);
    }


    async getCourseDetail(id: string): Promise<ICourse | null> {
        const course = await this._courseRepository.getCourseDetail(id);
        return course;
    }

    async updateCourse(
        courseId: string,
        courseData: Partial<ICourse>,
    ): Promise<ICourse | null> {

        const existingCourse = await this._courseRepository.getCourseDetail(courseId);

        if (!existingCourse) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COURSE_NOT_FOUND);

        const updatedFields: Partial<ICourse> = {};

        if (courseData.poster_url && courseData.poster_url !== existingCourse.poster_url) {
            if (existingCourse.poster_url) {
                const { publicId, resourceType, isAuthenticated } = extractCloudinaryDetails(existingCourse.poster_url);
                if (!publicId) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PUBLIC_ID_NOT_FOUND);
                }

                await deleteFromCloudinary(publicId, resourceType, isAuthenticated);
            }
            updatedFields.poster_url = courseData.poster_url;
        }

        if (courseData.preview_video_urls && courseData.preview_video_urls.length > 0) {
            const newPreviewVideoUrl = courseData.preview_video_urls[0];

            if (existingCourse.preview_video_urls.length > 0 && newPreviewVideoUrl !== existingCourse.preview_video_urls[0]) {
                const { publicId, resourceType, isAuthenticated } = extractCloudinaryDetails(existingCourse.preview_video_urls[0]);
                if (!publicId) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PUBLIC_ID_NOT_FOUND);
                }

                await deleteFromCloudinary(publicId, resourceType, isAuthenticated);
            }

            updatedFields.preview_video_urls = [newPreviewVideoUrl];
        }

        const updatedCourse = await this._courseRepository.updateById(courseId, {
            ...courseData,
            ...updatedFields,
        });

        return updatedCourse;
    }

    async deleteCourse(courseId: string): Promise<void> {
        const course = await this._courseRepository.getCourseDetail(courseId);

        if (!course) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COURSE_NOT_FOUND);
        }

        const topics = await this._topicService.getTopics(courseId);

        const mediaUrls = [
            ...course.preview_video_urls,
            course.poster_url
        ].filter(Boolean);

        if (topics) {
            topics?.topics?.forEach(topic => {
                if (topic.video_url) mediaUrls.push(topic.video_url);
                if (topic.notes_url) mediaUrls.push(topic.notes_url);
            });
        }

        if (mediaUrls.length > 0) {
            await Promise.all(
                mediaUrls.map(async (url) => {
                    const { publicId, resourceType, isAuthenticated } = extractCloudinaryDetails(url);
                    if (!publicId) return;

                    await deleteFromCloudinary(publicId, resourceType, isAuthenticated);
                })
            );
        }

        if (topics) {
            await this._courseRepository.deleteById(courseId);
        }

        await this._courseRepository.deleteById(courseId);
    }

    async addRating(userId: string, courseId: string, rating: number, review: string): Promise<void> {

        let ratingData = await this._ratingRepository.findOne({ courseId });

        const reviewObj = {
            userId: convertToObjectId(userId),
            rating,
            review
        }

        if (ratingData) {
            ratingData.reviews.push(reviewObj)

            await this._ratingRepository.save(ratingData);
        } else {
            const courseIdObj = convertToObjectId(courseId);
            ratingData = await this._ratingRepository.create({ courseId: courseIdObj, reviews: [reviewObj] });
            await this._ratingRepository.save(ratingData);
        }
    }

    async getRatings(courseId: string): Promise<IRating | null> {

        const ratings = await this._ratingRepository.findOne({ courseId });

        return ratings;
    }

    async getCoupons(): Promise<ICoupon[] | null> {

        const coupons = await this._couponRepository.findAll();
        console.log(coupons)

        return coupons;
    }

    async postCoupon(code: string, discount: number, isLiveStream: boolean): Promise<ICoupon> {

        const existCoupon = await this._couponRepository.getCouponByName(code.toUpperCase());

        if(existCoupon){
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.COUPON_ALREADY_EXIST);
        }
        
        const newCoupon = await this._couponRepository.create({ code, discount, isLiveStream });
        
        return newCoupon;
    }
    
    async editCoupon(couponId: string, updateData: Partial<ICoupon>): Promise<ICoupon | null> {
        
        const existCoupon = await this._couponRepository.getCouponByNameAndNotId(updateData.code as string, couponId);
        
        if(existCoupon){
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.COUPON_ALREADY_EXIST);
        }

        const updatedCoupon = await this._couponRepository.updateById(couponId, updateData);

        return updatedCoupon;
    }

    async deleteCoupon(couponId: string): Promise<void> {
        await this._couponRepository.deleteById(couponId);
    }

    async getOffers(): Promise<IOffer[] | null> {
        const offers = await this._offerRepository.findAll();

        return offers;
    }

    async postOffer(title: string, description: string, discount: number, expiryDate: string): Promise<IOffer> {

        const parsedExpiryDate = new Date(expiryDate);
        if (isNaN(parsedExpiryDate.getTime())) {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_DATE);
        }
        const newOffer = await this._offerRepository.create({ title, description, discount, expiryDate: parsedExpiryDate });

        return newOffer;
    }

    async applyOfferToCourse(courseId: string, offerId: string): Promise<void> {
        
        const course = await this._courseRepository.findById(courseId);
        if (!course) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COURSE_NOT_FOUND);
    
        const offer = await this._offerRepository.findById(offerId);
        if (!offer) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OFFER_NOT_FOUND);
    
        if (new Date(offer.expiryDate) < new Date()) {
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.OFFER_EXPIRED);
        }
        
        const objectOfferId = convertToObjectId(offerId);
        await this._courseRepository.updateById(courseId, { offer: objectOfferId });
    }

    async removeOfferFromCourse(courseId: string): Promise<void> {

        const course = await this._courseRepository.findById(courseId);
        if (!course) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COURSE_NOT_FOUND);

        await this._courseRepository.updateById(courseId, { offer: null });
    }
    

    async editOffer(offerId: string, updateData: Partial<IOffer>): Promise<void> {
        await this._offerRepository.updateById(offerId, updateData);
    }

    async deleteOffer(offerId: string): Promise<void> {
        await this._offerRepository.deleteById(offerId);
    }

    async applyCoupon(code: string, userId: string): Promise<ICoupon> {

        const coupon = await this._couponRepository.findOne({code});

        if(!coupon){
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.COUPON_NOT_FOUND);
        }
        const objectUserId = convertToObjectId(userId)
        if (coupon.usedBy.includes(objectUserId)) {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.COUPON_ALREADY_USED );
        }

        return coupon;
    }

    async addUserToCouponUser(code: string, userId: string): Promise<void> {
        
        const coupon = await this._couponRepository.findOne({code});

        if(coupon){
            const objectUserId = convertToObjectId(userId);
            coupon.usedBy.push(objectUserId);
            await this._couponRepository.save(coupon);
        }
    }
}