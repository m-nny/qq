import configUtils from '@qq/config';
import { defaultConfig, PlainConfig } from './default';

export const loadConfig = configUtils.loadConfigFactory(defaultConfig);
export { PlainConfig };

export class ConfigWrapper {
    public constructor(public config: PlainConfig) {}
}
