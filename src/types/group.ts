/**
 * Type definitions for the TrueNAS `group` namespace.
 * TrueNAS API v25.10
 */

import type { QueryFilter, QueryOptions } from "./common.js";

export interface GroupEntry {
  id: number;
  gid: number;
  name: string;
  builtin: boolean;
  sudo_commands: string[];
  sudo_commands_nopasswd: string[];
  smb: boolean;
  userns_idmap: "DIRECT" | number | null;
  group: string;
  local: boolean;
  sid: string | null;
  roles: string[];
  users: number[];
  immutable: boolean;
}

export interface GroupCreateParams {
  name: string;
  gid?: number | null;
  sudo_commands?: string[];
  sudo_commands_nopasswd?: string[];
  smb?: boolean;
  userns_idmap?: "DIRECT" | number | null;
  users?: number[];
}

export interface GroupUpdateParams {
  name?: string;
  sudo_commands?: string[];
  sudo_commands_nopasswd?: string[];
  smb?: boolean;
  userns_idmap?: "DIRECT" | number | null;
  users?: number[];
}

export interface GroupDeleteOptions {
  delete_users?: boolean;
}

export interface GroupQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions;
}
