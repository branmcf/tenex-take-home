import { config } from 'dotenv';

config();

process.env.IS_INTEGRATION_TESTING = '1';
process.env.REQUEST_CIRCUIT_BREAKER_HANDLER_DISABLED = '1';

process.env.DISABLE_WEB_SOCKETS_REDIS_ADAPTER = '1';
process.env.DISABLE_REDIS_CLIENT_TLS = '1';