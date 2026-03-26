/**
 * Type definitions for the TrueNAS `sharing.nfs` and `sharing.smb` namespaces.
 * TrueNAS API v25.10
 */

import type { QueryFilter, QueryOptions } from "./common.js";

// ─── NFS ─────────────────────────────────────────────────────────────────────

export type NFSSecurityType = "SYS" | "KRB5" | "KRB5I" | "KRB5P";

export interface SharingNFSEntry {
  id: number;
  path: string;
  aliases: string[];
  comment: string;
  networks: string[];
  hosts: string[];
  ro: boolean;
  maproot_user: string | null;
  maproot_group: string | null;
  mapall_user: string | null;
  mapall_group: string | null;
  security: NFSSecurityType[];
  enabled: boolean;
  locked: boolean | null;
  expose_snapshots: boolean;
}

export interface SharingNFSCreateParams {
  path: string;
  aliases?: string[];
  comment?: string;
  networks?: string[];
  hosts?: string[];
  ro?: boolean;
  maproot_user?: string | null;
  maproot_group?: string | null;
  mapall_user?: string | null;
  mapall_group?: string | null;
  security?: NFSSecurityType[];
  enabled?: boolean;
  expose_snapshots?: boolean;
}

export interface SharingNFSUpdateParams {
  path?: string;
  aliases?: string[];
  comment?: string;
  networks?: string[];
  hosts?: string[];
  ro?: boolean;
  maproot_user?: string | null;
  maproot_group?: string | null;
  mapall_user?: string | null;
  mapall_group?: string | null;
  security?: NFSSecurityType[];
  enabled?: boolean;
  expose_snapshots?: boolean;
}

export interface SharingNFSQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions;
}

// ─── SMB ─────────────────────────────────────────────────────────────────────

export type SMBSharePurpose =
  | "DEFAULT_SHARE"
  | "LEGACY_SHARE"
  | "TIMEMACHINE_SHARE"
  | "MULTIPROTOCOL_SHARE"
  | "TIME_LOCKED_SHARE"
  | "PRIVATE_DATASETS_SHARE"
  | "EXTERNAL_SHARE"
  | "VEEAM_REPOSITORY_SHARE"
  | "FCP_SHARE";

export interface SMBAuditConfig {
  enable: boolean;
  watch_list: string[];
  ignore_list: string[];
}

export interface SharingSMBEntry {
  id: number;
  purpose: SMBSharePurpose;
  name: string;
  path: string;
  enabled: boolean;
  comment: string;
  readonly: boolean;
  browsable: boolean;
  access_based_share_enumeration: boolean;
  locked: boolean | null;
  audit: SMBAuditConfig;
  options: Record<string, unknown> | null;
}

export interface SharingSMBCreateParams {
  name: string;
  path: string;
  purpose?: SMBSharePurpose;
  enabled?: boolean;
  comment?: string;
  readonly?: boolean;
  browsable?: boolean;
  access_based_share_enumeration?: boolean;
  audit?: Partial<SMBAuditConfig>;
  options?: Record<string, unknown> | null;
}

export interface SharingSMBUpdateParams {
  name?: string;
  path?: string;
  purpose?: SMBSharePurpose;
  enabled?: boolean;
  comment?: string;
  readonly?: boolean;
  browsable?: boolean;
  access_based_share_enumeration?: boolean;
  audit?: Partial<SMBAuditConfig>;
  options?: Record<string, unknown> | null;
}

export interface SharingSMBQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions;
}
