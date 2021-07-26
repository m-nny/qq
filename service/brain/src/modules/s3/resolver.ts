import { singleton } from 'tsyringe';
import { Arg, Query, Resolver } from 'type-graphql';
import { S3Service } from './service';

@singleton()
@Resolver()
export class S3Resolver {
    constructor(private s3: S3Service) {}
    @Query(() => String)
    async getUploadUrl(@Arg('filename') filename: string): Promise<string> {
        return await this.s3.getDatasetUploadUrl(filename);
    }
}
