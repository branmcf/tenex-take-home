import globals from 'globals';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import typescript from 'typescript-eslint';
import parser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';


export default [
    eslint.configs.recommended
    , {
        languageOptions: { parser, globals: globals.node }
        , files: [ '**/*.[jt]s', '**/*.mjs' ]
        , rules: {
            'no-inline-comments': 'error'
            , 'no-array-constructor': 'error'
            , 'lines-around-comment': [
                'error'
                , {
                    beforeLineComment: true
                    , beforeBlockComment: true
                    , allowBlockStart: true
                    , ignorePattern: '-'
                }
            ]
            , 'no-unused-vars': [
                'error'
                , {
                    args: 'after-used'
                    , caughtErrors: 'none'
                }
            ]
            , 'func-style': [ 'error', 'expression' ]
            , 'no-negated-condition': 'error'
            , 'no-unneeded-ternary': 'error'
            , 'prefer-object-spread': 'error'
            , 'no-case-declarations': 'error'
            , 'no-unsafe-finally': 'error'
            , 'no-unreachable': 'error'
            , 'no-empty-pattern': 'error'
            , 'no-empty-function': 'off'
            , 'no-console': 'error'
        }
    }
    , {
        plugins: { '@stylistic': stylistic }
        , languageOptions: { parser, globals: globals.node }
        , files: [ '**/*.[jt]s', '**/*.mjs' ]
        , rules: {
            '@stylistic/indent': [
                'error'
                , 4
                , { SwitchCase: 1 }
            ]
            , '@stylistic/max-len': [
                'error'
                , {
                    code: 120
                    , ignoreTemplateLiterals: true
                    , ignoreStrings: true
                    , ignoreRegExpLiterals: true
                    , ignoreUrls: true
                    , comments: 80
                    , ignorePattern: 'eslint-*|@typescript-eslint-*|\\sPromise<Either<|\\sinterface\\s\\w|instanceof|\\s=\\sawait\\sPromise.all\\(|usersAuthSessionsService|equals:\\s|\\w+<.+>'
                }
            ]
            , '@stylistic/multiline-comment-style': [ 'error', 'starred-block' ]
            , '@stylistic/spaced-comment': [
                'error'
                , 'always'
                , {
                    line: { exceptions: [ '-' ] }
                    , block: { exceptions: [ '-' ] }
                }
            ]
            , '@stylistic/comma-style': [
                'error'
                , 'first'
                , {
                    exceptions: {
                        CallExpression: false
                        , ArrayExpression: false
                        , ArrayPattern: false
                        , FunctionExpression: false
                        , FunctionDeclaration: false
                        , ArrowFunctionExpression: false
                        , ObjectPattern: false
                        , VariableDeclaration: false
                        , NewExpression: false
                        , ImportDeclaration: false
                    }
                }
            ]
            , '@stylistic/comma-spacing': [
                'error'
                , {
                    before: false
                    , after: true
                }
            ]
            , '@stylistic/comma-dangle': [ 'error', 'never' ]
            , '@stylistic/quotes': [
                'error'
                , 'single'
                , { allowTemplateLiterals: true }
            ]
            , '@stylistic/linebreak-style': [ 'warn', 'unix' ]
            , '@stylistic/space-in-parens': [ 'error', 'always' ]
            , '@stylistic/array-bracket-spacing': [ 'error', 'always' ]
            , '@stylistic/computed-property-spacing': [ 'error', 'always' ]
            , '@stylistic/object-curly-spacing': [ 'error', 'always' ]
            , '@stylistic/object-curly-newline': [
                'error'
                , {
                    ObjectExpression: {
                        multiline: true
                        , minProperties: 4
                    }
                    , ObjectPattern: {
                        multiline: true
                        , minProperties: 4
                    }
                    , ImportDeclaration: {
                        multiline: true
                        , minProperties: 3
                    }
                }
            ]
            , '@stylistic/array-element-newline': [
                'error'
                , {
                    multiline: true
                    , minItems: 3
                }
            ]
            , '@stylistic/object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true } ]
            , '@stylistic/key-spacing': [ 'error', { beforeColon: false } ]
            , '@stylistic/template-curly-spacing': [ 'error', 'always' ]
            , '@stylistic/brace-style': [
                'error'
                , '1tbs'
                , { allowSingleLine: true }
            ]
            , '@stylistic/space-before-function-paren': 'off'
            , '@stylistic/func-call-spacing': [ 'error', 'never' ]
            , '@stylistic/semi': [ 'error', 'always' ]
            , '@stylistic/operator-linebreak': [
                'error'
                , 'before'
                , {
                    overrides: {
                        '?': 'before'
                        , ':': 'before'
                    }
                }
            ]
            , '@stylistic/no-mixed-operators': 'error'
            , '@stylistic/function-call-argument-newline': [ 'error', 'consistent' ]
            , '@stylistic/function-paren-newline': [ 'error', 'multiline-arguments' ]
            , '@stylistic/newline-per-chained-call': [ 'error', { ignoreChainWithDepth: 2 } ]
            , '@stylistic/array-bracket-newline': [ 'error', { multiline: true } ]
            , '@stylistic/space-before-blocks': 'error'
            , '@stylistic/no-mixed-spaces-and-tabs': 'error'
            , '@stylistic/no-trailing-spaces': 'error'
            , '@stylistic/multiline-ternary': [ 'error', 'always-multiline' ]
            , '@stylistic/no-multiple-empty-lines': [
                'error'
                , {
                    max: 2
                    , maxEOF: 0
                    , maxBOF: 0
                }
            ]
            , '@stylistic/quote-props': [ 'error', 'as-needed' ]
            , '@stylistic/semi-spacing': [
                'error'
                , {
                    before: false
                    , after: true
                }
            ]
            , '@stylistic/wrap-regex': 'error'
            , '@stylistic/block-spacing': 'error'
            , '@stylistic/space-infix-ops': 'error'

            , '@stylistic/keyword-spacing': [
                'error'
                , {
                    before: true
                    , after: true
                }
            ]
            , '@stylistic/padding-line-between-statements': [
                'error'
                , {
                    blankLine: 'always'
                    , prev: 'import'
                    , next: '*'
                }
                , {
                    blankLine: 'any'
                    , prev: 'import'
                    , next: 'import'
                }
                , {
                    blankLine: 'always'
                    , prev: [ 'multiline-const', 'export' ]
                    , next: [ 'multiline-const', 'export' ]
                }
                , {
                    blankLine: 'always'
                    , prev: '*'
                    , next: 'block-like'
                }
                , {
                    blankLine: 'always'
                    , prev: 'block-like'
                    , next: '*'
                }
            ]
            , '@stylistic/member-delimiter-style': 'error'
            , '@stylistic/type-annotation-spacing': 'error'
        }
    }

    , ...typescript.config( typescript.configs.recommended )
    , {
        files: [ '**/*.ts' ]
        , languageOptions: {
            parser
            , parserOptions: {
                sourceType: 'module'
                , tsconfigRootDir: import.meta.dirname
                , project: [ './tsconfig.json' ]
            }
        }
        , rules: {
            '@typescript-eslint/no-unsafe-function-type': 'off'
            , '@typescript-eslint/prefer-for-of': 'error'
            , '@typescript-eslint/prefer-optional-chain': 'error'
            , '@typescript-eslint/ban-ts-ignore': 'off'
            , '@typescript-eslint/explicit-function-return-type': 'off'
            , '@typescript-eslint/explicit-module-boundary-types': 'error'
            , '@typescript-eslint/naming-convention': [
                'error'
                , {
                    selector: 'default'
                    , format: [ 'camelCase' ]
                }
                , {
                    selector: 'variable'
                    , format: [ 'camelCase', 'UPPER_CASE' ]
                }
                , {
                    selector: 'parameter'
                    , format: [ 'camelCase' ]
                    , leadingUnderscore: 'allow'
                }
                , {
                    selector: 'memberLike'
                    , format: [ 'camelCase' ]
                }
                , {
                    selector: 'typeLike'
                    , format: [ 'PascalCase' ]
                }
                , {
                    selector: 'enumMember'
                    , format: [ 'PascalCase', 'UPPER_CASE' ]
                }
                , {
                    selector: 'import'
                    , format: [ 'PascalCase', 'camelCase' ]
                }
            ]
        }
    }

    , jest.configs[ 'flat/recommended' ]
    , {
        plugins: { jest }
        , rules: {
            'jest/expect-expect': [ 'error', { assertFunctionNames: [ 'expect' ] } ]
            , 'jest/prefer-lowercase-title': [
                'error'
                , {
                    allowedPrefixes: [
                        'GET'
                        , 'POST'
                        , 'PUT'
                        , 'DELETE'
                        , 'PATCH'
                    ]
                }
            ]
            , 'jest/no-mocks-import': 'off'
        }
    }
];
