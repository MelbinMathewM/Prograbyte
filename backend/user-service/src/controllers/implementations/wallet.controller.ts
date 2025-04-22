import { inject } from "inversify";
import { IWalletController } from "../interfaces/IWallet.controller";
import { WalletService } from "@/services/implementations/wallet.service";
import { NextFunction, Request, Response } from "express";

export class WalletController implements IWalletController {
    constructor(@inject(WalletService) private _walletService: WalletService) { }

    async addCourseToWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            await this._walletService
        }catch(err){
            next(err);
        }
    }
}