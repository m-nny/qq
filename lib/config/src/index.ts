import * as cfgVar from './cfgVar';
import * as constants from './constants';
import * as loadConfig from './loadConfig';
import * as types from './types';
import * as utils from './utils';
export * from './cfgVar';
export * from './constants';
export * from './loadConfig';
export * from './types';
export * from './utils';

const configUtils = {
    ...cfgVar,
    ...loadConfig,
    ...types,
    ...utils,
    ...constants,
};
export default configUtils;
