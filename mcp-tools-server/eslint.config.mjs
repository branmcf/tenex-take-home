import globals from 'globals';
import eslint from '@eslint/js';
import typescript from 'typescript-eslint';
import parser from '@typescript-eslint/parser';

export default [
    { ignores: [ 'dist/**', 'node_modules/**' ] }
    , eslint.configs.recommended
    , ...typescript.config( typescript.configs.recommended )
    , {
        files: [ '**/*.ts', '**/*.js', '**/*.mjs' ]
        , languageOptions: {
            parser
            , parserOptions: { sourceType: 'module' }
            , globals: globals.node
        }
    }
];
