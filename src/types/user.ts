/**
 * Type definitions for the TrueNAS `user` namespace.
 * TrueNAS API v25.10
 */

import type { QueryFilter, QueryOptions, DateTimeString } from "./common.js";

export interface UserEntry {
  id: number;
  uid: number;
  username: string;
  unixhash: string | null;
  smbhash: string | null;
  home: string;
  shell: string;
  full_name: string;
  builtin: boolean;
  smb: boolean;
  userns_idmap: "DIRECT" | number | null;
  group: Record<string, unknown>;
  groups: number[];
  password_disabled: boolean;
  ssh_password_enabled: boolean;
  sshpubkey: string | null;
  locked: boolean;
  sudo_commands: string[];
  sudo_commands_nopasswd: string[];
  email: string | null;
  local: boolean;
  immutable: boolean;
  twofactor_auth_configured: boolean;
  sid: string | null;
  last_password_change: DateTimeString | null;
  password_age: number | null;
  password_history: Record<string, unknown>[] | null;
  password_change_required: boolean;
  roles: string[];
  api_keys: number[];
}

export interface UserCreateParams {
  uid?: number | null;
  username: string;
  home?: string;
  shell?: string;
  full_name: string;
  smb?: boolean;
  userns_idmap?: "DIRECT" | number | null;
  group?: number | null;
  groups?: number[];
  password_disabled?: boolean;
  ssh_password_enabled?: boolean;
  sshpubkey?: string | null;
  locked?: boolean;
  sudo_commands?: string[];
  sudo_commands_nopasswd?: string[];
  email?: string | null;
  group_create?: boolean;
  home_create?: boolean;
  home_mode?: string;
  password?: string | null;
  random_password?: boolean;
}

export interface UserCreateResult extends UserEntry {
  password: string | null;
}

export interface UserUpdateParams {
  username?: string;
  home?: string;
  shell?: string;
  full_name?: string;
  smb?: boolean;
  userns_idmap?: "DIRECT" | number | null;
  group?: number | null;
  groups?: number[];
  password_disabled?: boolean;
  ssh_password_enabled?: boolean;
  sshpubkey?: string | null;
  locked?: boolean;
  sudo_commands?: string[];
  sudo_commands_nopasswd?: string[];
  email?: string | null;
  home_create?: boolean;
  home_mode?: string;
  password?: string | null;
  random_password?: boolean;
}

export interface UserDeleteOptions {
  delete_group?: boolean;
}

export interface UserGetUserObjParams {
  username?: string | null;
  uid?: number | null;
  get_groups?: boolean;
  sid_info?: boolean;
}

export interface UserGetUserObjResult {
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
}

export interface UserQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions;
}
