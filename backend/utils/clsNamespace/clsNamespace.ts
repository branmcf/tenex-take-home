import { createNamespace } from 'cls-hooked';

export const clsNamespace = createNamespace( 'tenex-take-home-api' );

export const getNamespaceContext = (): { [ key: string ]: unknown } | null => {
    return clsNamespace.active;
};

export const createNamespaceAttribute = ( attributeName: string, attributeValue: unknown ): void => {
    clsNamespace.set( attributeName, attributeValue );
};

export const getNamespaceAttribute = <T> ( attributeName: string ): T | undefined => {
    return clsNamespace.get( attributeName );
};

export const createNamespaceRun = async <T> ( fn: () => Promise<T> ): Promise<T> => {
    return clsNamespace.runPromise<T>( fn );
};

export const enterNamespaceContext = ( namespaceContext: { [ key: string ]: unknown } | null ): void => {
    return clsNamespace.enter( namespaceContext );
};

export const exitNamespaceContext = ( namespaceContext: { [ key: string ]: unknown } | null ): void => {
    return clsNamespace.exit( namespaceContext );
};