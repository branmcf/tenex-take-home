import * as rawLs from 'langsmith/jest';

const wrapTestMethod = method => {

    return ( name, maybeParams, maybeFn, timeout ) => {

        if ( typeof maybeParams === 'function' ) {
            return method( name, { inputs: {}, referenceOutputs: {} }, maybeParams, timeout );
        }

        return method( name, maybeParams, maybeFn, timeout );

    };

};

const ls = {
    ...rawLs
    , test: wrapTestMethod( rawLs.test )
    , it: wrapTestMethod( rawLs.it )
};

export default ls;
