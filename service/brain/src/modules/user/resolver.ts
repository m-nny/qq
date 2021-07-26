import { singleton } from 'tsyringe';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User } from './entity';
import { UserService } from './service';

@singleton()
@Resolver(User)
export class UserResolver {
    constructor(private user: UserService) {}
    @Query(() => String)
    async helloWorld() {
        return 'Hello there';
    }

    @Query(() => User, { nullable: true })
    async getUserByKey(
        @Arg('username') username: string
    ): Promise<User | null> {
        return await this.user.findByKey({ username });
    }
    @Mutation(() => User)
    async register(
        @Arg('username') username: string,
        @Arg('fullname') fullname: string
    ): Promise<User> {
        const user = await this.user.create({ username, fullname });
        return user;
    }
}
