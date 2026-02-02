"use client";

import { WorkflowsPageLayout } from "@/components/layout/WorkflowsPageLayout";
import { use } from "react";

export default function WorkflowPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = use(params);
  return <WorkflowsPageLayout initialWorkflowId={workflowId} />;
}
