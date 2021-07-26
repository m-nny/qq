import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { DependencyContainer } from 'tsyringe';
import { buildSchema } from 'type-graphql';
import { ConfigWrapper, loadConfig } from './modules/config';
import { connectToTypeorm } from './modules/typeorm';
import { UserResolver } from './modules/user/resolver';

export const configureContainer = async (
    container: DependencyContainer
): Promise<DependencyContainer> => {
    const config = loadConfig();
    container.register(ConfigWrapper, { useValue: new ConfigWrapper(config) });
    return container;
};

export const waitUntilReady = async (
    container: DependencyContainer
): Promise<DependencyContainer> => {
    await connectToTypeorm(container);
    return container;
};

export const runApp = async (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const schema = await buildSchema({
        resolvers: [UserResolver],
        container: { get: (someClass) => container.resolve(someClass) },
    });
    const apolloServer = new ApolloServer({ schema });
    await apolloServer.start();

    const app = Express();
    apolloServer.applyMiddleware({ app });
    const port = config.port;
    await new Promise<void>((resolve) => app.listen({ port }, resolve));

    console.log(`server stated on http://localhost:${port}/graphql`);
};
