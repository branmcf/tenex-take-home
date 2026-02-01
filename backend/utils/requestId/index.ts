import cls from 'cls-hooked';

/**
 * This function looks at the current namespace
 * and returns the requestId attribute that is
 * assigned at the beginning of a request's
 * lifecycle.
 */
export const getCurrentRequestId = (): string | undefined => {
    const namespace = cls.getNamespace( 'tenex-take-home-api' );
    const requestId: string = namespace?.get( 'requestId' );
    return requestId;
};