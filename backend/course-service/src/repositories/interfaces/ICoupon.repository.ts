import { ICoupon } from "@/models/coupon.model";
import { IBaseRepository } from "../IBase.repository";

export interface ICouponRepository extends IBaseRepository<ICoupon> {
    getCouponByName(code: string): Promise<ICoupon | null>;
    getCouponByNameAndNotId(code: string, id: string): Promise<ICoupon | null>;
}