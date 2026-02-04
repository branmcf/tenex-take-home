import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- extend tools for MCP metadata
        ALTER TABLE tools
            ADD COLUMN source TEXT NOT NULL DEFAULT 'local' CHECK (source IN ('mcp', 'local')),
            ADD COLUMN external_id TEXT,
            ADD COLUMN version TEXT,
            ADD COLUMN schema_hash TEXT,
            ADD COLUMN last_synced_at TIMESTAMPTZ;

        CREATE UNIQUE INDEX tools_external_id_unique
            ON tools(external_id)
            WHERE source = 'mcp' AND external_id IS NOT NULL;

        -- track workflow name/description sources
        ALTER TABLE workflows
            ADD COLUMN name_source TEXT NOT NULL DEFAULT 'auto' CHECK (name_source IN ('auto', 'user')),
            ADD COLUMN description_source TEXT NOT NULL DEFAULT 'auto' CHECK (description_source IN ('auto', 'user'));

        -- store workflow change proposals
        CREATE TABLE workflow_proposals (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
            base_version_id UUID REFERENCES workflow_versions(id) ON DELETE SET NULL,
            user_message TEXT NOT NULL CHECK (length(user_message) > 0),
            model_id TEXT,
            tool_calls JSONB NOT NULL,
            proposed_dag JSONB NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMPTZ NOT NULL
        );

        CREATE INDEX workflow_proposals_workflow_id_created_at_idx
            ON workflow_proposals(workflow_id, created_at);

        CREATE INDEX workflow_proposals_expires_at_idx
            ON workflow_proposals(expires_at);

        -- update dag comment to reflect tool references
        COMMENT ON COLUMN workflow_versions.dag IS 'JSONB structure: { steps: [{ id, name, instruction, tools: [{ id, name, version }], dependsOn: string[] }] }';
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        COMMENT ON COLUMN workflow_versions.dag IS 'JSONB structure: { steps: [{ id, name, instruction, tools: string[], dependsOn: string[] }] }';

        DROP INDEX IF EXISTS workflow_proposals_expires_at_idx;
        DROP INDEX IF EXISTS workflow_proposals_workflow_id_created_at_idx;
        DROP TABLE IF EXISTS workflow_proposals;

        ALTER TABLE workflows
            DROP COLUMN IF EXISTS description_source,
            DROP COLUMN IF EXISTS name_source;

        DROP INDEX IF EXISTS tools_external_id_unique;

        ALTER TABLE tools
            DROP COLUMN IF EXISTS last_synced_at,
            DROP COLUMN IF EXISTS schema_hash,
            DROP COLUMN IF EXISTS version,
            DROP COLUMN IF EXISTS external_id,
            DROP COLUMN IF EXISTS source;
    ` );
};
