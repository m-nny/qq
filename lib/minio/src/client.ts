import * as Minio from 'minio';
import { ConfigWithS3Options } from './types';
import { makePublicPolicyStringified } from './utils';

export const makeMinioClient = (config: ConfigWithS3Options): Minio.Client => {
    const client = new MinioClient(config.s3.connection);
    return client;
};

export const waitUntilMinioClientReady = async (
    config: ConfigWithS3Options,
    client: Minio.Client
): Promise<void> => {
    const bucketNames = Object.keys(config.s3.bucket.names);
    for (const bucketName of bucketNames) {
        await checkIfExists(client, bucketName, config);
    }
};

export const makeMinioClientAndWaitUntilReady = async (
    config: ConfigWithS3Options
): Promise<Minio.Client> => {
    const client = makeMinioClient(config);
    await waitUntilMinioClientReady(config, client);
    return client;
};
export const checkIfExists = async (
    minioClient: Minio.Client,
    bucketName: string,
    config: ConfigWithS3Options
): Promise<boolean> => {
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (bucketExists) {
        return false;
    }
    if (!config.s3.bucket.createIfNotExists) {
        console.log(`Bucket ${bucketName} does not exists`);
        process.exit(1);
    }
    await minioClient.makeBucket(bucketName, config.s3.connection.region ?? '');
    console.log({ bucketName }, `${bucketName} bucket created`);
    if (config.s3.bucket.makePublic) {
        await minioClient.setBucketPolicy(
            bucketName,
            makePublicPolicyStringified(bucketName)
        );
        await minioClient.getBucketPolicy(bucketName);
        console.log({ bucketName }, `${bucketName} bucket made public created`);
    }
    return true;
};

export class MinioClient extends Minio.Client {}
