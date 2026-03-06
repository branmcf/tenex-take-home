import * as rawLs from 'langsmith/jest';
import type {
    LangSmithJestlikeWrapperParams
    , LangSmithJestlikeTestFunction
} from 'langsmith/jest';

type DefaultTestFn =
    LangSmithJestlikeTestFunction<
        Record<string, unknown>
        , Record<string, unknown>
    >;

type DefaultParams =
    LangSmithJestlikeWrapperParams<
        Record<string, unknown>
        , Record<string, unknown>
    >;

type LsTestFn = {
    ( name: string, fn: DefaultTestFn, timeout?: number ): void;
    ( name: string, lsParams: DefaultParams, fn: DefaultTestFn, timeout?: number ): void;
};

const wrapTestMethod = ( method: typeof rawLs.test ): LsTestFn => {

    return ( (
        name: string
        , maybeParams: DefaultParams | DefaultTestFn
        , maybeFn?: DefaultTestFn
        , timeout?: number
    ) => {

        if ( typeof maybeParams === 'function' ) {
            return method(
                name
                , { inputs: {}, referenceOutputs: {} }
                , maybeParams
                , timeout
            );
        }

        return method(
            name
            , maybeParams
            , maybeFn!
            , timeout
        );

    } ) as LsTestFn;

};

const ls = {
    ...rawLs
    , test: wrapTestMethod( rawLs.test )
    , it: wrapTestMethod( rawLs.it )
};

export default ls;
