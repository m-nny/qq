import { MinioClient } from '@qq/minio';
import { singleton } from 'tsyringe';
import { v4 } from 'uuid';
import { ConfigWrapper } from '../config';

@singleton()
export class S3Service {
    private s3Config;
    constructor(private minio: MinioClient, { config }: ConfigWrapper) {
        this.s3Config = config.s3;
    }
    async getDatasetUploadUrl(filename: string): Promise<string> {
        const bucketName = this.s3Config.bucket.names.storage;
        const timestamp = new Date().getTime();
        const id = v4();
        const relativeUrl = `datasets/${timestamp}_${id}_${filename}`;
        const uploadUrl = await this.minio.presignedPutObject(
            bucketName,
            relativeUrl
        );
        return uploadUrl;
    }
}
