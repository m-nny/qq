import { DependencyContainer } from 'tsyringe';
import {
    Connection,
    createConnection,
    useContainer as useContainerForTypeOrm,
} from 'typeorm';
import { entities } from '..';
import { ConfigWrapper } from '../config';

export const connectToTypeorm = async (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    useContainerForTypeOrm({ get: (x) => container.resolve(x as any) });
    const connection = await createConnection({
        type: 'postgres',
        name: 'default',
        ...config.typeorm,
        ...config.pg,
        entities: entities,
    });
    // entities.map((item) => item.useConnection(connection));
    container.register(Connection, { useValue: connection });
    return connection;
};
