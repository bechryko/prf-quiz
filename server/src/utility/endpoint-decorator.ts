import { Router } from 'express';
import { Logger } from './logger';

interface EndpointOptions {
   method: 'post' | 'get' | 'delete';
   path: string;
}

interface EndpointOptionsWithFunctionData extends EndpointOptions {
   target: any;
   propertyKey: string;
}

const endpoints: EndpointOptionsWithFunctionData[] = [];

export function Endpoint(options: EndpointOptions) {
   return function (target: any, propertyKey: string) {
      endpoints.push({
         ...options,
         target,
         propertyKey
      });
   };
}

export function registerEndpoints(router: Router, providers: any[]): void {
   endpoints.forEach(endpointOptions => {
      const { method, path, target, propertyKey } = endpointOptions;
      const instance = getInstance(target, providers);
      const handler = instance[propertyKey].bind(instance);
      router[method](path, handler);
      Logger.details(`Registered endpoint ${path} (${method})`);
   });
}

function getInstance(target: any, providers: any[]): any {
   const instance = providers.find(p => Object.getPrototypeOf(p) === target);
   if (!instance) {
      throw new Error(`No provider for ${target}!`);
   }
   return instance;
}
