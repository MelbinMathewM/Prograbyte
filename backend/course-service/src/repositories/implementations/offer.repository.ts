import Offer, { IOffer } from "@/models/offer.model";
import { BaseRepository } from "../base.repository";
import { IOfferRepository } from "../interfaces/IOffer.repository";
import { injectable } from "inversify";

@injectable()
export class OfferRepository extends BaseRepository<IOffer> implements IOfferRepository {
    constructor() {
        super(Offer);
    }
}