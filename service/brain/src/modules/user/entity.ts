import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn, Repository } from 'typeorm';

@Entity()
@ObjectType()
export class User {
    @PrimaryColumn()
    @Field(() => ID)
    username!: string;

    @Column()
    @Field()
    fullname!: string;
}
export type UserKey = Pick<User, 'username'>;
export type CreateUser = Omit<User, never>;

export type UserRepository = Repository<User>;
