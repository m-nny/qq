export const appEnvs = ['dev', 'k8s', 'compose', 'test'] as const;
export type AppEnv = typeof appEnvs[number];
export type Overrider<T> = (value: string | undefined) => T;
export type ArrayOverrider<T> = Overrider<
    Array<T> | Array<Record<string, T>> | null
>;
export type ConfigConstant = string | number | boolean | null;
export type ConfigShape = {
    [key: string]:
        | Overrider<ConfigConstant>
        | ArrayOverrider<ConfigConstant>
        | ConfigConstant
        | ConfigShape;
};
export type RootConfigShape = ConfigShape & { env: AppEnv };
export type AppEnvConfigShape<Config extends ConfigShape> =
    PartialConfigShape<Config>;

export const createConfig = <T extends RootConfigShape>(config: T): T => config;
export const createConfigPart = <T extends ConfigShape>(config: T): T => config;
export const createConfigPartFrom = <T>(
    config: ConfigShapeFrom<T>
): ConfigShapeFrom<T> => config;
export const createAppEnvConfig = <T extends ConfigShape>(
    config: AppEnvConfigShape<T>
): AppEnvConfigShape<T> => config;

// prettier-ignore
export type PlainConfigShape<Config extends ConfigShape> = {
    [K in keyof Config]:
        Config[K] extends ConfigConstant ? Config[K] :
        Config[K] extends Overrider<infer T>? T :
        Config[K] extends ConfigShape ? PlainConfigShape<Config[K]> :
        never;
};

// prettier-ignore
export type PartialConfigShape<Config extends ConfigShape> = {
    [K in keyof Config]?:
        Config[K] extends ConfigConstant ? Config[K] :
        Config[K] extends Overrider<infer T> ? T :
        Config[K] extends Array<ConfigShape> ? Array<PartialConfigShape<Config[K][number]>> :
        Config[K] extends ConfigShape ? PartialConfigShape<Config[K]>:
        never;
};

// prettier-ignore
export type ConfigShapeFrom<Value> = {
    [K in keyof Value]-?:
        Value[K] extends ConfigConstant ? Overrider<Value[K]>:
        NonNullable<Value[K]> extends ConfigConstant ? Overrider<NonNullable<Value[K]>> | undefined :
        Value[K] extends Record<string, any> ? ConfigShapeFrom<Value[K]> :
        never;
};

export type AppEnvOverride<C extends RootConfigShape> = Partial<
    Record<AppEnv, AppEnvConfigShape<C>>
>;
