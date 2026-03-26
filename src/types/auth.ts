/**
 * Type definitions for the TrueNAS `auth` namespace.
 * TrueNAS API v25.10
 */

import type { QueryFilter, QueryOptions, DateTimeString } from "./common.js";

export interface AuthMeResult {
  pw_name: string;
  pw_gecos: string;
  pw_dir: string;
  pw_shell: string;
  pw_uid: number;
  pw_gid: number;
  grouplist: number[] | null;
  sid: string | null;
  source: "LOCAL" | "ACTIVEDIRECTORY" | "LDAP";
  local: boolean;
  attributes: Record<string, unknown>;
  two_factor_config: Record<string, unknown>;
  privilege: Record<string, unknown>;
  account_attributes: string[];
}

export type AuthSessionCredentialType =
  | "UNIX_SOCKET"
  | "LOGIN_PASSWORD"
  | "LOGIN_TWOFACTOR"
  | "LOGIN_ONETIME_PASSWORD"
  | "API_KEY"
  | "TOKEN"
  | "TRUENAS_NODE";

export interface AuthSessionEntry {
  id: string;
  current: boolean;
  internal: boolean;
  origin: string;
  credentials: AuthSessionCredentialType;
  credentials_data: Record<string, unknown>;
  created_at: DateTimeString;
  secure_transport: boolean;
}

export interface AuthGenerateTokenParams {
  ttl?: number | null;
  attrs?: Record<string, unknown>;
  match_origin?: boolean;
  single_use?: boolean;
}

export interface AuthSessionsQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions;
}
