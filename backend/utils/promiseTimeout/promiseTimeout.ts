import { ResourceError } from '../../errors';
import { Either, error } from '../../types';
import { PromiseTimeout } from './promiseTimeout.errors';

/**
 *
 * @param promise
 * @param timeout in milliseconds
 *
 * This will disregard the promise if it
 * takes longer than the timeout and return
 * a PromiseTimeout error
 */
export const promiseTimeout = async <T> (
    promise: Promise<Either<ResourceError, T>>
    , timeout: number
): Promise<Either<ResourceError, T>> => {
    let setTimeoutId: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<Either<ResourceError, T>>(
        resolve => {
            setTimeoutId = setTimeout(
                () => resolve( error( new PromiseTimeout( timeout ) ) )
                , timeout
            );
        }
    );

    const result = await Promise.race( [ promise, timeoutPromise ] );

    if ( setTimeoutId ) {
        clearTimeout( setTimeoutId );
    }

    return result;
};