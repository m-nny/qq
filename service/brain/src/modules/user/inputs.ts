import { IsString, Length } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
@ArgsType()
export class RegisterInput {
    @Field()
    @IsString()
    @Length(4, 30)
    username!: string;

    @Field()
    @IsString()
    @Length(4, 30)
    fullname!: string;
}
