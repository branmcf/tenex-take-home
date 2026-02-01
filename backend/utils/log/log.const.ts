export const SKIPPED_REQ_PATHS = new Set( [ '/leafiness/readiness', '/leafiness/liveness' ] );

export const SKIPPED_RES_PATHS = SKIPPED_REQ_PATHS;

export const OBFUSCATED_ATTRIBUTE_NAMES = new Set( [
    'accountNumber'
    , 'routingNumber'
    , 'password'
    , 'ssn'
    , 'socialSecurityNumber'
    , 'key'
] );

export const ENABLE_LEVEL_PREFIX = process.env.DISABLE_LOG_LEVEL_PREFIX !== '1';

export const ENABLE_CONSOLE_COLORS = process.env.ENABLE_CONSOLE_COLORS === '1' || process.env.ENVIRONMENT === 'local';