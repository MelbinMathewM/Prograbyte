import { injectable } from 'inversify';
import User, { IUser } from '../../models/UserModel';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
    
    async createUser(user: IUser): Promise<IUser> {
        return await User.create(user);
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({email});
    }

    async getUserById(id: string): Promise<IUser | null> {
        return await User.findOne({_id: id});
    }

    async deleteUserById(id: string): Promise<void> {
        await User.deleteOne({_id: id}) 
    }

    async updateUser(id: string, user: Partial<IUser>): Promise<IUser | null> {
        return await User.findOneAndUpdate(
            {_id: id},
            { $set: user },
            { new: true }
        )
    }

    async findUserByUsername(username: string): Promise<IUser | null> {
        return await User.findOne({username});
    }
}