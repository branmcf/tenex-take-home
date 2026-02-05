import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Soft-delete MCP tools that are not part of the supported workflow tool set
        UPDATE tools
        SET deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE source = 'mcp'
            AND is_system = true
            AND deleted_at IS NULL
            AND name NOT IN (
                'web_search',
                'read_url',
                'http_request',
                'summarize',
                'extract_json'
            );

        -- Upsert the canonical MCP workflow tools
        INSERT INTO tools (
            name,
            description,
            schema,
            is_system,
            user_id,
            source,
            external_id,
            version,
            deleted_at,
            created_at,
            updated_at,
            last_synced_at
        )
        VALUES
            (
                'web_search',
                'Search the web for information',
                '{"type":"object","properties":{"query":{"type":"string"},"limit":{"type":"number"}},"required":["query"],"additionalProperties":false}',
                true,
                NULL,
                'mcp',
                'tool_web_search',
                '1.0.0',
                NULL,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ),
            (
                'read_url',
                'Fetch a URL and extract readable text content',
                '{"type":"object","properties":{"url":{"type":"string"},"maxChars":{"type":"number"}},"required":["url"],"additionalProperties":false}',
                true,
                NULL,
                'mcp',
                'tool_read_url',
                '1.0.0',
                NULL,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ),
            (
                'http_request',
                'Make an HTTP API request',
                '{"type":"object","properties":{"url":{"type":"string"},"method":{"type":"string"},"headers":{"type":"object"},"body":{"type":["object","string","number","boolean","array","null"]},"timeoutMs":{"type":"number"}},"required":["url","method"],"additionalProperties":false}',
                true,
                NULL,
                'mcp',
                'tool_http_request',
                '1.0.0',
                NULL,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ),
            (
                'summarize',
                'Summarize a block of text into a shorter form',
                '{"type":"object","properties":{"text":{"type":"string"},"maxWords":{"type":"number"}},"required":["text"],"additionalProperties":false}',
                true,
                NULL,
                'mcp',
                'tool_summarize',
                '1.0.0',
                NULL,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ),
            (
                'extract_json',
                'Extract a JSON object or array from text',
                '{"type":"object","properties":{"text":{"type":"string"},"fields":{"type":"array","items":{"type":"string"}}},"required":["text"],"additionalProperties":false}',
                true,
                NULL,
                'mcp',
                'tool_extract_json',
                '1.0.0',
                NULL,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
        ON CONFLICT (name) WHERE is_system = true DO UPDATE
        SET description = EXCLUDED.description,
            schema = EXCLUDED.schema,
            source = EXCLUDED.source,
            external_id = EXCLUDED.external_id,
            version = EXCLUDED.version,
            is_system = true,
            user_id = NULL,
            deleted_at = NULL,
            updated_at = CURRENT_TIMESTAMP,
            last_synced_at = CURRENT_TIMESTAMP;
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Re-enable MCP tools that were soft-deleted by this migration
        UPDATE tools
        SET deleted_at = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE source = 'mcp'
            AND is_system = true
            AND name NOT IN (
                'web_search',
                'read_url',
                'http_request',
                'summarize',
                'extract_json'
            );

        -- Remove MCP tools that were introduced by this migration
        DELETE FROM tools
        WHERE source = 'mcp'
            AND is_system = true
            AND name IN (
                'read_url',
                'summarize',
                'extract_json'
            )
            AND external_id IN (
                'tool_read_url',
                'tool_summarize',
                'tool_extract_json'
            );
    ` );
};
