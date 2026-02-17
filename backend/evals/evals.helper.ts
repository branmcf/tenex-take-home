import { expect } from '@jest/globals';
import { exactMatch, EvaluatorResult } from 'openevals';

const assertExactMatch = async <TOutputs, TReference>(
    outputs: TOutputs
    , referenceOutputs: TReference
): Promise<EvaluatorResult> => {

    const result = await exactMatch( {
        outputs
        , referenceOutputs
    } );
    expect( result.score ).toBe( true );
    return result;

};

const logAndAssertExactMatch = async <TOutputs, TReference>(
    ls: { logOutputs: ( payload: TOutputs ) => void }
    , outputs: TOutputs
    , referenceOutputs: TReference
): Promise<EvaluatorResult> => {

    ls.logOutputs( outputs );
    return assertExactMatch( outputs, referenceOutputs );

};

export {
    assertExactMatch
    , logAndAssertExactMatch
};
