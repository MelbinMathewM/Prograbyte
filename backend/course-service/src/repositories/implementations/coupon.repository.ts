import Coupon, { ICoupon } from "@/models/coupon.model";
import { BaseRepository } from "../base.repository";
import { ICouponRepository } from "../interfaces/ICoupon.repository";
import { injectable } from "inversify";

@injectable()
export class CouponRepository extends BaseRepository<ICoupon> implements ICouponRepository {
    constructor() {
        super(Coupon);
    }

    async getCouponByName(code: string): Promise<ICoupon | null> {
        try {
            return await this.model.findOne({ code: { $regex: new RegExp(`^${code}$`, "i") } });
        } catch (error) {
            console.error("Error fetching coupon by name:", error);
            throw new Error("Failed to retrieve coupon");
        }
    }

    async getCouponByNameAndNotId(code: string, id: string): Promise<ICoupon | null> {
        try {
            return await this.model.findOne({
                code: { $regex: new RegExp(`^${code}$`, "i") },
                _id: { $ne: id }
            });
        } catch (error) {
            console.error("Error fetching coupon by code and not ID:", error);
            throw new Error("Failed to retrieve coupon");
        }
    }
}