import { IUser } from "@/models/user.model";
import { IBaseRepository } from "@/repositories/IBase.repository";

export interface IUserRepository extends IBaseRepository<IUser> {
    
}