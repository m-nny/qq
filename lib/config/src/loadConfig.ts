import { config } from 'dotenv';
import { flatten, unflatten } from 'flat';
import _ from 'lodash';
import path from 'path';
import util from 'util';
import { APP_ENV_KEY, PROJECT_PREFIX } from './constants';
import {
    AppEnvConfigShape,
    AppEnvOverride,
    PartialConfigShape,
    PlainConfigShape,
    RootConfigShape,
} from './types';
import { getAppEnvironment, loadStrFromFile } from './utils';

export const loadConfigFactory =
    <C extends RootConfigShape>(
        defaultConfig: C,
        appEnvOverrides: AppEnvOverride<C> = {}
    ) =>
    (override: PartialConfigShape<C> = {}): PlainConfigShape<C> => {
        const { parsed = {} } = config({
            path: path.resolve(process.cwd(), `../../.env`),
        });
        const envVariables = Object.assign(parsed, process.env);
        const appEnv = getAppEnvironment(envVariables[APP_ENV_KEY]);
        const appEnvOverride: AppEnvConfigShape<C> = _.merge(
            { env: appEnv },
            appEnvOverrides[appEnv]
        );

        const flatAppEnvOverride: Record<string, unknown> = flatten(
            appEnvOverride,
            { delimiter: '_', safe: true }
        );
        const flatOverride: Record<string, unknown> = flatten(override, {
            delimiter: '_',
            safe: true,
        });
        const flatConfig: Record<
            string,
            (override: string | undefined) => unknown
        > = flatten(defaultConfig, {
            delimiter: '_',
        });
        const overrides: Record<string, string> = {};
        const overridedFlatConfig = Object.entries(flatConfig).reduce(
            (acc, [key, valueFnOrValue]) => {
                const parseEnv = (val: string | undefined) =>
                    typeof valueFnOrValue === 'function'
                        ? valueFnOrValue(val)
                        : val;

                const ENV_KEY = `${PROJECT_PREFIX}_${key}`;
                const ENV_FILE_KEY = `${PROJECT_PREFIX}FILE_${key}`;
                const fromEnv =
                    envVariables[ENV_KEY] === undefined
                        ? undefined
                        : parseEnv(envVariables[ENV_KEY]);
                const fromEnvFile =
                    envVariables[ENV_FILE_KEY] === undefined
                        ? undefined
                        : parseEnv(loadStrFromFile(envVariables[ENV_FILE_KEY]));
                // загрузка из 4 источников:
                // arg - первый приоритет из аргументов `loadConfig`
                // env - из переменных окружения и .env файла
                // envf - из переменных окружения FILE и .env файла
                // sta - статический конфиг, соответствующий окружению
                // def - конфиг по-умолчанию default.ts
                // err - ошибка при загрузке
                const values: Array<
                    ['arg' | 'env' | 'envf' | 'sta' | 'def' | 'err', unknown]
                > = [
                    ['arg', flatOverride[key]],
                    ['envf', fromEnvFile],
                    ['env', fromEnv],
                    ['sta', flatAppEnvOverride[key]],
                    [
                        'def',
                        typeof valueFnOrValue === 'function'
                            ? valueFnOrValue(undefined)
                            : valueFnOrValue,
                    ],
                ];

                const [from, value] = values.find(
                    ([, x]) => x !== undefined
                ) || ['err', undefined];
                acc[key] = value;

                overrides[
                    key
                ] = `[${from}] -> ${value} (${typeof value}) trace: [${values
                    .map(([, x]) => String(x))
                    .join(' -> ')}]`;
                return acc;
            },
            {} as Record<string, unknown>
        );

        const overridedConfig: PlainConfigShape<C> = unflatten(
            overridedFlatConfig,
            { delimiter: '_' }
        );

        console.log(
            `Config loaded:`,
            util.inspect(unflatten(overrides, { delimiter: '_' }), {
                showHidden: false,
                depth: null,
                // colors: true,
            })
        );
        return overridedConfig;
    };
