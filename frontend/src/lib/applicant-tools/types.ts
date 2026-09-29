/**
 * Applicant AI Tool Layer — Core Types and Contracts
 * In compliance with applicant-tool-spec (1)/02_TOOL_SCHEMAS_AND_RESULT_CONTRACT.md
 */

import { ZodSchema } from "zod";

export type ToolErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "DEPENDENCY_BLOCKED"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "UPSTREAM_ERROR"
  | "STALE_DATA"
  | "CONFIRMATION_REQUIRED";

export type ToolRiskLevel =
  | "READ"
  | "WRITE_LOW_RISK"
  | "WRITE_CONFIRM"
  | "UI_ACTION";

export interface ToolSource {
  type: "official" | "internal" | "derived";
  title?: string;
  url?: string;
  documentId?: string;
  section?: string;
  retrievedAt?: string;
}

export interface ToolResult<T = any> {
  ok: boolean;
  data?: T;
  error?: {
    code: ToolErrorCode;
    message: string;
    recoverable: boolean;
    retryAfterSeconds?: number;
    fieldErrors?: Record<string, string>;
  };
  meta: {
    tool: string;
    executedAt: string;
    requestId: string;
    freshness?: string;
    sources?: ToolSource[];
    latencyMs?: number;
  };
}

export interface ToolExecutionContext {
  requestId: string;
  userId: string;
  sessionId: string;
  role: "applicant";
  locale?: string;
  timezone?: string;
  activeProjectId?: string;
  activeApplicationId?: string;
  confirmationToken?: string;
}

export interface AppTool<TInput = any, TOutput = any> {
  name: string;
  description: string;
  risk: ToolRiskLevel;
  inputSchema: ZodSchema<TInput>;
  execute: (
    input: TInput,
    ctx: ToolExecutionContext
  ) => Promise<ToolResult<TOutput>>;
}

export type AssistantEvent =
  | {
      type: "message";
      text: string;
    }
  | {
      type: "tool_status";
      tool: string;
      state: "running" | "complete" | "failed";
    }
  | {
      type: "navigate";
      routeId:
        | "HOME"
        | "DISCOVER"
        | "APPLICATION"
        | "DOCUMENTS"
        | "APPROVAL"
        | "TRACKING"
        | "DEPENDENCIES"
        | "SIMULATOR";
      params?: Record<string, string>;
    }
  | {
      type: "focus_field";
      applicationId: string;
      fieldId: string;
    }
  | {
      type: "open_document";
      documentId: string;
    }
  | {
      type: "open_approval";
      approvalId: string;
    }
  | {
      type: "confirm_action";
      actionId: string;
      label: string;
      summary: string;
    };
