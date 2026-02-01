import { ResourceError } from '../../errors';
import {
    Either, Success, success
} from '../../types';
import { generateRandomInteger } from '../randoms';
import { promiseTimeout } from './promiseTimeout';
import { PromiseTimeout } from './promiseTimeout.errors';

describe( 'promiseTimeout', () => {
    const thinkOfNumber = ( thinkingDuration: number ) => new Promise<Either<ResourceError, number>>(
        resolve => setTimeout(
            () => resolve( success( generateRandomInteger() ) )
            , thinkingDuration
        )
    );

    it(
        'returns actual value when promise resolves sooner than the timeout'
        , async () => {
            const promiseTimeoutResult = await promiseTimeout(
                thinkOfNumber( 100 )
                , 20000
            );

            expect( promiseTimeoutResult )
                .toBeInstanceOf( Success );
        }
    );

    it(
        'returns a promise timeout error when the promise exceeds the timeout'
        , async () => {
            const promiseTimeoutResult = await promiseTimeout(
                thinkOfNumber( 400 )
                , 200
            );

            expect( promiseTimeoutResult.value )
                .toBeInstanceOf( PromiseTimeout );
        }
    );
} );