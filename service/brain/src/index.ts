import 'reflect-metadata';
import { container } from 'tsyringe';
import { configureContainer, runApp, waitUntilReady } from './app';

configureContainer(container).then(waitUntilReady).then(runApp);
