import { singleton } from 'tsyringe';
import { Connection } from 'typeorm';
import { CreateUser, User, UserKey, UserRepository } from './entity';

@singleton()
export class UserService {
    private repository: UserRepository;
    constructor(connection: Connection) {
        this.repository = connection.getRepository(User);
    }
    async findByKey(key: UserKey): Promise<User | null> {
        const user = await this.repository.findOne(key);
        return user ?? null;
    }
    async create(userInfo: CreateUser): Promise<User> {
        const user = this.repository.create(userInfo);
        return await this.repository.save(user);
    }
}
