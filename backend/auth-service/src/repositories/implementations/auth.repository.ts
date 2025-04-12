import { injectable } from "inversify";
import Auth, { IAuth } from "../../models/auth.model";
import { IAuthRepository } from "../interfaces/IAuth.repository";
import { BaseRepository } from "../base.repository";

@injectable()
export class AuthRepository extends BaseRepository<IAuth> implements IAuthRepository {

    constructor(){
        super(Auth)
    }
    
}