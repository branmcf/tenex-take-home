import { config } from 'dotenv';

config();

process.env.IS_INTEGRATION_TESTING = '1';

// Set a test API key if not already set
if ( !process.env.MCP_TOOLS_API_KEY ) {
    process.env.MCP_TOOLS_API_KEY = 'test-api-key';
}
