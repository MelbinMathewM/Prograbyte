import { injectable } from 'inversify';
import User, { IUser } from '@/models/user.model';
import { IUserRepository } from '../interfaces/IUser.repository';
import { BaseRepository } from '@/repositories/base.repository';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {

    constructor(){
        super(User);
    }

}
