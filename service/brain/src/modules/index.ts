import { S3Resolver } from './s3/resolver';
import { User, UserResolver } from './user';

export const entities = [User];

export const resolvers = [UserResolver, S3Resolver] as const;
