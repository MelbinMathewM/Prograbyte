import { injectable } from "inversify";
import { IWalletService } from "../interfaces/IWallet.service";
import { inject } from "inversify";
import { IWalletRepository } from "@/repositories/interfaces/IWallet.repository";

@injectable()
export class WalletService implements IWalletService {
    constructor(
        @inject("IWalletRepository") private _walletRepository: IWalletRepository
    ) { }

    async addCourseToWallet(): Promise<void> {
        
    }
}