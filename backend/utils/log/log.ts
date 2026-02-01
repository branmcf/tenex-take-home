import { getNamespaceAttribute } from '../clsNamespace';
import {
    ENABLE_CONSOLE_COLORS
    , ENABLE_LEVEL_PREFIX
    , OBFUSCATED_ATTRIBUTE_NAMES
    , SKIPPED_REQ_PATHS
    , SKIPPED_RES_PATHS
} from './log.const';
import {
    LogLevel
    , ReqParams
    , ResParams
} from './log.types';

export class Log {

    /* eslint-disable no-console */

    private static logLevels = <LogLevel[]> ( process.env.LOG_LEVELS || '' ).split( ',' );

    static req = ( {
        method
        , path
        , query
        , requestBody
    }: ReqParams ): void => {
        if ( !this.logLevels.includes( 'req' ) && this.logLevels[ 0 ] !== '*' ) {
            return;
        }

        if ( SKIPPED_REQ_PATHS.has( path ) ) {
            return;
        }

        let logContent = `${ method } ${ path }`;

        const stringifiedQuery = JSON.stringify(
            query
            , ( attributeName, value ) => OBFUSCATED_ATTRIBUTE_NAMES.has( attributeName )
                ? '********'
                : value
        );

        if ( stringifiedQuery !== '{}' ) {
            logContent += ` | query: ${ stringifiedQuery }`;
        }

        const stringifiedRequestBody = JSON.stringify(
            requestBody
            , ( attributeName, value ) => OBFUSCATED_ATTRIBUTE_NAMES.has( attributeName )
                ? '********'
                : value
        );

        if ( stringifiedRequestBody !== '{}' ) {
            logContent += ` | requestBody: ${ stringifiedRequestBody }`;
        }

        const requestId = getNamespaceAttribute<string>( 'requestId' );

        if ( requestId ) {
            logContent = requestId + ' | ' + logContent;
        }

        if ( process.env.ENVIRONMENT === 'local' ) {
            logContent += '\n';
        }

        const consoleLogArgs: Parameters<Console['log']> = [];

        let prefix: string | undefined;

        if ( ENABLE_LEVEL_PREFIX ) prefix = 'req:';
        if ( ENABLE_LEVEL_PREFIX && ENABLE_CONSOLE_COLORS ) prefix = '\x1b[36mreq:\x1b[0m';
        if ( prefix ) consoleLogArgs.push( prefix );

        consoleLogArgs.push( logContent );

        return console.log( ...consoleLogArgs );
    };

    static res = ( {
        method
        , path
        , query
        , requestBody
        , responseBody
        , statusCode
        , duration
    }: ResParams ): void => {
        if ( !this.logLevels.includes( 'res' ) && this.logLevels[ 0 ] !== '*' ) {
            return;
        }

        if ( SKIPPED_RES_PATHS.has( path ) ) {
            return;
        }

        let logContent = `${ statusCode } `;

        /** red */
        if ( ENABLE_CONSOLE_COLORS && statusCode >= 500 ) logContent = `\x1b[31m${ statusCode }\x1b[0m `;

        /** yellow */
        else if ( ENABLE_CONSOLE_COLORS && statusCode >= 400 ) logContent = `\x1b[33m${ statusCode }\x1b[0m `;

        /** blue */
        else if ( ENABLE_CONSOLE_COLORS && statusCode >= 300 ) logContent = `\x1b[34m${ statusCode }\x1b[0m `;

        /** green */
        else if ( ENABLE_CONSOLE_COLORS && statusCode >= 200 ) logContent = `\x1b[32m${ statusCode }\x1b[0m `;

        logContent += `${ method } ${ path } ${ duration }ms`;

        const stringifiedQuery = JSON.stringify(
            query
            , ( attributeName, value ) => OBFUSCATED_ATTRIBUTE_NAMES.has( attributeName )
                ? '********'
                : value
        );

        if ( stringifiedQuery !== '{}' ) {
            logContent += ` | query: ${ stringifiedQuery }`;
        }

        const stringifiedRequestBody = JSON.stringify(
            requestBody
            , ( attributeName, value ) => OBFUSCATED_ATTRIBUTE_NAMES.has( attributeName )
                ? '********'
                : value
        );

        if ( stringifiedRequestBody !== '{}' ) {
            logContent += ` | requestBody: ${ stringifiedRequestBody }`;
        }

        const stringifiedResponseBody = JSON.stringify(
            responseBody
            , ( attributeName, value ) => OBFUSCATED_ATTRIBUTE_NAMES.has( attributeName )
                ? '********'
                : value
        );

        if ( stringifiedResponseBody !== '{}' ) {
            logContent += ` | responseBody: ${ stringifiedResponseBody }`;
        }

        const requestId = getNamespaceAttribute<string>( 'requestId' );

        if ( requestId ) {
            logContent = requestId + ' | ' + logContent;
        }

        if ( process.env.ENVIRONMENT === 'local' ) {
            logContent += '\n';
        }

        const consoleLogArgs: Parameters<Console['log']> = [];

        let prefix: string | undefined;

        if ( ENABLE_LEVEL_PREFIX ) prefix = 'res:';
        if ( ENABLE_LEVEL_PREFIX && ENABLE_CONSOLE_COLORS ) prefix = '\x1b[34mres:\x1b[0m';
        if ( prefix ) consoleLogArgs.push( prefix );

        consoleLogArgs.push( logContent );

        return console.log( ...consoleLogArgs );
    };

    static debug = ( ...args: Parameters<Console['log']> ): void => {
        if ( !this.logLevels.includes( 'debug' ) && this.logLevels[ 0 ] !== '*' ) {
            return;
        }

        const consoleLogArgs: Parameters<Console['log']> = [];

        let prefix: string | undefined;

        if ( ENABLE_LEVEL_PREFIX ) prefix = 'debug:';
        if ( ENABLE_LEVEL_PREFIX && ENABLE_CONSOLE_COLORS ) prefix = '\x1b[35mdebug:\x1b[0m';
        if ( prefix ) consoleLogArgs.push( prefix );

        const requestId = getNamespaceAttribute<string>( 'requestId' );
        if ( requestId ) consoleLogArgs.push( requestId );

        consoleLogArgs.push( ...args );

        return console.log( ...consoleLogArgs );
    };

    static info = ( ...args: Parameters<Console['log']> ): void => {
        if ( !this.logLevels.includes( 'info' ) && this.logLevels[ 0 ] !== '*' ) {
            return;
        }

        const consoleLogArgs: Parameters<Console['log']> = [];

        let prefix: string | undefined;

        if ( ENABLE_LEVEL_PREFIX ) prefix = 'info:';
        if ( ENABLE_LEVEL_PREFIX && ENABLE_CONSOLE_COLORS ) prefix = '\x1b[32minfo:\x1b[0m';
        if ( prefix ) consoleLogArgs.push( prefix );

        const requestId = getNamespaceAttribute<string>( 'requestId' );
        if ( requestId ) consoleLogArgs.push( requestId );

        consoleLogArgs.push( ...args );

        return console.log( ...consoleLogArgs );
    };

    static warn = ( ...args: Parameters<Console['error']> ): void => {
        if ( !this.logLevels.includes( 'warn' ) && this.logLevels[ 0 ] !== '*' ) {
            return;
        }

        const consoleLogArgs: Parameters<Console['log']> = [];

        let prefix: string | undefined;

        if ( ENABLE_LEVEL_PREFIX ) prefix = 'warn:';
        if ( ENABLE_LEVEL_PREFIX && ENABLE_CONSOLE_COLORS ) prefix = '\x1b[33mwarn:\x1b[0m';
        if ( prefix ) consoleLogArgs.push( prefix );

        const requestId = getNamespaceAttribute<string>( 'requestId' );
        if ( requestId ) consoleLogArgs.push( requestId );

        consoleLogArgs.push( ...args );

        return console.log( ...consoleLogArgs );
    };

    static error = ( ...args: Parameters<Console['error']> ): void => {
        if ( !this.logLevels.includes( 'error' ) && this.logLevels[ 0 ] !== '*' ) {
            return;
        }


        const consoleLogArgs: Parameters<Console['log']> = [];

        let prefix: string | undefined;

        if ( ENABLE_LEVEL_PREFIX ) prefix = 'error:';
        if ( ENABLE_LEVEL_PREFIX && ENABLE_CONSOLE_COLORS ) prefix = '\x1b[31merror:\x1b[0m';
        if ( prefix ) consoleLogArgs.push( prefix );

        const requestId = getNamespaceAttribute<string>( 'requestId' );
        if ( requestId ) consoleLogArgs.push( requestId );

        consoleLogArgs.push( ...args );

        return console.error( ...consoleLogArgs );
    };

    static dir = ( ...args: Parameters<Console['dir']> ): void => {
        if ( !this.logLevels.includes( 'info' ) && this.logLevels[ 0 ] !== '*' ) {
            return;
        }

        const requestId = getNamespaceAttribute<string>( 'requestId' );

        if ( requestId ) {
            console.log( requestId );
            return console.dir( ...args );
        }

        return console.dir( ...args );
    };
}