import { ClientOptions } from 'minio';

export type ConfigWithS3Options = {
    s3: {
        connection: ClientOptions;
        bucket: {
            createIfNotExists: boolean;
            makePublic: boolean;
            names: Record<string, string>;
        };
    };
};
