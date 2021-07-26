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
        password: configUtils.string('qq'),
        database: configUtils.string('brain'),
    },
    typeorm: {
        entities: configUtils.array(['src/modules/*/entity.ts']),
        synchronize: configUtils.boolean(true),
        logging: configUtils.boolean(false),
    },
});

export type PlainConfig = PlainConfigShape<typeof defaultConfig>;
