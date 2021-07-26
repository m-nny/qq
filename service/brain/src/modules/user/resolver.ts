import { singleton } from 'tsyringe';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { User } from './entity';
import { RegisterInput } from './inputs';
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
    async register(@Arg('data') data: RegisterInput): Promise<User> {
        return await this.user.create(data);
    }
}
