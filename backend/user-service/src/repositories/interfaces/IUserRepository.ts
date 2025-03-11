import { IUser } from "../../models/UserModel";

export interface IUserRepository {
    createUser(user: IUser) : Promise<IUser>;
    getUserByEmail(email: string) : Promise<IUser | null>;
    getUserById(id: string) : Promise<IUser | null>;
    deleteUserById(id: string): Promise<void>;
    updateUser(id: string, user: Partial<IUser>): Promise<IUser | null>;
}