import configUtils from '@qq/config';

const defaultConfig = configUtils.createConfig({
    env: 'dev',
});

const loadConfig = configUtils.loadConfigFactory(defaultConfig);

const config = loadConfig();
console.log(config);
