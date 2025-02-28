import { injectable } from "inversify";
import Auth, { IAuth } from "../../models/AuthModel";
import { IAuthRepository } from "../interfaces/IAuthRepository";

@injectable()
export class AuthRepository implements IAuthRepository {

    async getUserByEmail(email: string): Promise<IAuth | null> {
        return await Auth.findOne({email});
    }

    async createUserByGrpc(authData: IAuth): Promise<IAuth> {
        return await Auth.create(authData);
    }
    
}