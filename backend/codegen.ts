/* eslint-disable @typescript-eslint/naming-convention*/
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: { 'http://localhost:3026/graphql': { headers: {} } }
    , overwrite: true
    , generates: {
        'lib/postGraphile/postGraphile.generatedTypes.ts': {
            plugins: [ { add: { content: '/* eslint-disable */' } }, 'typescript' ]
            , config: {
                scalars: {
                    Int: 'number'
                    , date: 'string'
                    , jsonb: 'any'
                    , numeric: 'number'
                    , time: 'string'
                    , timestamptz: 'string'
                }
            }
        }
        , 'lib/postGraphile': {
            preset: 'near-operation-file'
            , presetConfig: {
                extension: '.generatedTypes.ts'
                , baseTypesPath: 'postGraphile.generatedTypes.ts'
            }
            , documents: [ 'lib/postGraphile/**/**!(*.generated*).ts' ]
            , plugins: [ { add: { content: '/* eslint-disable */' } }, 'typescript-operations' ]
            , config: {
                scalars: {
                    Int: 'number'
                    , date: 'string'
                    , jsonb: 'any'
                    , numeric: 'number'
                    , time: 'string'
                    , timestamptz: 'string'
                }
                , nonOptionalTypename: true
            }
        }
        , app: {
            preset: 'near-operation-file'
            , presetConfig: {
                extension: '.generatedTypes.ts'
                , baseTypesPath: '../lib/postGraphile/postGraphile.generatedTypes.ts'
            }
            , documents: [ 'app/**/**!(*.generated*).ts' ]
            , plugins: [ { add: { content: '/* eslint-disable */' } }, 'typescript-operations' ]
            , config: {
                scalars: {
                    Int: 'number'
                    , date: 'string'
                    , jsonb: 'any'
                    , numeric: 'number'
                    , time: 'string'
                    , timestamptz: 'string'
                }
                , nonOptionalTypename: true
            }
        }
        , lib: {
            preset: 'near-operation-file'
            , presetConfig: {
                extension: '.generatedTypes.ts'
                , baseTypesPath: 'postGraphile/postGraphile.generatedTypes.ts'
            }
            , documents: [ 'lib/workflowProposals/**/**!(*.generated*).ts' ]
            , plugins: [ { add: { content: '/* eslint-disable */' } }, 'typescript-operations' ]
            , config: {
                scalars: {
                    Int: 'number'
                    , date: 'string'
                    , jsonb: 'any'
                    , numeric: 'number'
                    , time: 'string'
                    , timestamptz: 'string'
                }
                , nonOptionalTypename: true
            }
        }
        , factory: {
            preset: 'near-operation-file'
            , presetConfig: {
                extension: '.generatedTypes.ts'
                , baseTypesPath: '../lib/postGraphile/postGraphile.generatedTypes.ts'
            }
            , documents: [ 'factory/**/**!(*.generated*).ts' ]
            , plugins: [ { add: { content: '/* eslint-disable */' } }, 'typescript-operations' ]
            , config: {
                scalars: {
                    Int: 'number'
                    , date: 'string'
                    , jsonb: 'any'
                    , numeric: 'number'
                    , time: 'string'
                    , timestamptz: 'string'
                }
                , nonOptionalTypename: true
            }
        }
    }

    // set to false once collection dev has begun
    , ignoreNoDocuments: true
};

export default config;
