import { IAuth } from "../../models/AuthModel";

export interface IAuthRepository {
    getUserByEmail(email: string): Promise<IAuth | null>;
    createUserByGrpc(authData: IAuth): Promise<IAuth>;
}