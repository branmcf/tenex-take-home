import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Workflow versions table: stores immutable compiled DAG versions of workflows
        CREATE TABLE workflow_versions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
            version_number INT NOT NULL CHECK (version_number > 0),
            source_description TEXT,
            dag JSONB NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(workflow_id, version_number)
        );

        -- Indexes
        CREATE INDEX workflow_versions_workflow_id_version_idx
            ON workflow_versions(workflow_id, version_number DESC);

        -- Add comment documenting DAG structure
        COMMENT ON COLUMN workflow_versions.dag IS 'JSONB structure: { steps: [{ id, name, instruction, tools: string[], dependsOn: string[] }] }';
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP INDEX IF EXISTS workflow_versions_workflow_id_version_idx;
        DROP TABLE IF EXISTS workflow_versions;
    ` );
};
