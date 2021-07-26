import configUtils, { PlainConfigShape } from '@qq/config';

export const defaultConfig = configUtils.createConfig({
    env: 'dev',
    port: configUtils.number(3001),
    graphql: {
        endpoint: configUtils.string('graphql'),
    },
    pg: {
        host: configUtils.string('localhost'),
        port: configUtils.number(9001),
        username: configUtils.string('qq'),
        password: configUtils.string('misiq'),
        database: configUtils.string('brain'),
    },
    typeorm: {
        entities: configUtils.array(['src/modules/*/entity.ts']),
        synchronize: configUtils.boolean(true),
        logging: configUtils.boolean(false),
    },
    s3: {
        connection: {
            endPoint: configUtils.string('localhost'),
            port: configUtils.number(9002),
            accessKey: configUtils.string('qq-qq'),
            secretKey: configUtils.string('misiq-misiq'),
            useSSL: configUtils.boolean(false),
        },
        bucket: {
            createIfNotExists: configUtils.boolean(true),
            makePublic: configUtils.boolean(true),
            names: {
                storage: 'storage',
            },
        },
    },
});

export type PlainConfig = PlainConfigShape<typeof defaultConfig>;
