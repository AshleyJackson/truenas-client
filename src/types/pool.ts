/**
 * Type definitions for the TrueNAS `pool`, `pool.dataset`, and `pool.snapshot` namespaces.
 * TrueNAS API v25.10
 */

import type { QueryFilter, QueryOptions } from "./common.js";

// ─── Pool ────────────────────────────────────────────────────────────────────

export type PoolStatus =
  | "ONLINE"
  | "DEGRADED"
  | "FAULTED"
  | "OFFLINE"
  | "UNAVAIL"
  | "REMOVED";

export interface PoolTopologyDisk {
  type: "DISK";
  path: string | null;
  guid: string;
  status: string;
  stats: Record<string, unknown>;
  device: string | null;
  disk: string | null;
}

export interface PoolTopologyVdev {
  type: string;
  path: string | null;
  guid: string;
  status: string;
  stats: Record<string, unknown>;
  children: PoolTopologyDisk[];
}

export interface PoolTopology {
  data: PoolTopologyVdev[];
  log: PoolTopologyVdev[];
  cache: PoolTopologyVdev[];
  spare: PoolTopologyVdev[];
  special: PoolTopologyVdev[];
  dedup: PoolTopologyVdev[];
}

export interface PoolEntry {
  id: number;
  name: string;
  guid: string;
  status: PoolStatus;
  path: string;
  scan: Record<string, unknown>;
  topology: PoolTopology;
  healthy: boolean;
  warning: boolean;
  status_code: string | null;
  status_detail: string | null;
  size: number | null;
  allocated: number | null;
  free: number | null;
  freeing: number | null;
  fragmentation: string | null;
  size_str: string | null;
  allocated_str: string | null;
  free_str: string | null;
  freeing_str: string | null;
  autotrim: Record<string, unknown>;
  is_upgraded: boolean;
  is_decrypted: boolean;
  encrypt: number;
  encryptkey: string;
  encryptkey_path: string | null;
}

export interface PoolQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions;
}

export type PoolVdevType =
  | "STRIPE"
  | "MIRROR"
  | "RAIDZ1"
  | "RAIDZ2"
  | "RAIDZ3"
  | "DRAID1"
  | "DRAID2"
  | "DRAID3";

export interface PoolCreateVdev {
  type: PoolVdevType;
  disks: string[];
}

export interface PoolCreateTopology {
  data: PoolCreateVdev[];
  log?: PoolCreateVdev[];
  cache?: PoolCreateVdev[];
  spare?: PoolCreateVdev[];
  special?: PoolCreateVdev[];
  dedup?: PoolCreateVdev[];
}

export interface PoolCreateParams {
  name: string;
  encryption?: boolean;
  deduplication?: string | null;
  checksum?: string | null;
  ashift?: number;
  topology: PoolCreateTopology;
  allow_duplicate_serials?: boolean;
}

export interface PoolUpdateParams {
  autotrim?: string;
  topology?: Partial<PoolCreateTopology>;
  allow_duplicate_serials?: boolean;
}

export interface PoolExportParams {
  cascade?: boolean;
  restart_services?: boolean;
  destroy?: boolean;
}

export interface PoolImportParams {
  guid: string;
  name?: string;
  enable_attachments?: boolean;
}

export interface PoolAttachParams {
  target_vdev: string;
  new_disk: string;
  allow_duplicate_serials?: boolean;
}

// ─── Dataset ─────────────────────────────────────────────────────────────────

export type DatasetType = "FILESYSTEM" | "VOLUME";

export interface DatasetEntry {
  id: string;
  type: DatasetType;
  name: string;
  pool: string;
  encrypted: boolean;
  encryption_root: string | null;
  key_loaded: boolean;
  children: DatasetEntry[];
  managed_by: Record<string, unknown> | null;
  quota: Record<string, unknown> | null;
  refquota: Record<string, unknown> | null;
  reservation: Record<string, unknown> | null;
  refreservation: Record<string, unknown> | null;
  encryption_algorithm: Record<string, unknown> | null;
  origin: Record<string, unknown>;
  quota_warning: Record<string, unknown> | null;
  quota_critical: Record<string, unknown> | null;
  refquota_warning: Record<string, unknown> | null;
  refquota_critical: Record<string, unknown> | null;
  mountpoint: string | null;
  aclmode: Record<string, unknown> | null;
  acltype: Record<string, unknown> | null;
  share_type: Record<string, unknown> | null;
  xattr: Record<string, unknown> | null;
  atime: Record<string, unknown> | null;
  casesensitivity: Record<string, unknown> | null;
  checksum: Record<string, unknown> | null;
  exec: Record<string, unknown> | null;
  sync: Record<string, unknown> | null;
  compression: Record<string, unknown> | null;
  compressratio: Record<string, unknown> | null;
  deduplication: Record<string, unknown> | null;
  readonly: Record<string, unknown> | null;
  recordsize: Record<string, unknown> | null;
  snapdir: Record<string, unknown> | null;
  snap_count: number;
  snap_count_recursive: number;
  available: Record<string, unknown> | null;
  used: Record<string, unknown> | null;
  usedbychildren: Record<string, unknown> | null;
  usedbydataset: Record<string, unknown> | null;
  usedbyrefreservation: Record<string, unknown> | null;
  usedbysnapshots: Record<string, unknown> | null;
  comments: Record<string, unknown> | null;
  locked: boolean;
  pbkdf2iters: Record<string, unknown> | null;
  volsize: Record<string, unknown> | null;
  volblocksize: Record<string, unknown> | null;
  key_format: Record<string, unknown> | null;
  thick_provisioning: boolean;
  nfs_shares: Record<string, unknown>[];
  smb_shares: Record<string, unknown>[];
  iscsi_shares: Record<string, unknown>[];
  vms: Record<string, unknown>[];
  apps: Record<string, unknown>[];
  replication_tasks_count: number;
  snapshot_tasks_count: number;
  cloudsync_tasks_count: number;
  cloud_backup_tasks_count: number;
  rsync_tasks_count: number;
  user_properties: Record<string, unknown>;
}

export interface DatasetCreateParams {
  name: string;
  type?: DatasetType;
  volsize?: number;
  volblocksize?: string;
  sparse?: boolean;
  force_size?: boolean;
  comments?: string;
  sync?: string;
  snapdev?: string;
  compression?: string;
  atime?: string;
  exec?: string;
  managedby?: string;
  quota?: number | null;
  quota_warning?: number | string;
  quota_critical?: number | string;
  refquota?: number | null;
  refquota_warning?: number | string;
  refquota_critical?: number | string;
  reservation?: number;
  refreservation?: number;
  special_small_block_size?: number;
  copies?: number;
  snapdir?: string;
  deduplication?: string;
  checksum?: string;
  readonly?: string;
  recordsize?: string;
  casesensitivity?: string;
  aclmode?: string;
  acltype?: string;
  share_type?: string;
  xattr?: string;
  encryption_options?: {
    generate_key?: boolean;
    pbkdf2iters?: number;
    algorithm?: string;
    passphrase?: string | null;
    key?: string | null;
  };
  encryption?: boolean;
  inherit_encryption?: boolean;
  user_properties?: { key: string; value: string }[];
  create_ancestors?: boolean;
}

export interface DatasetUpdateParams {
  volsize?: number;
  force_size?: boolean;
  comments?: string;
  sync?: string;
  snapdev?: string;
  compression?: string;
  atime?: string;
  exec?: string;
  managedby?: string;
  quota?: number | null;
  quota_warning?: number | string;
  quota_critical?: number | string;
  refquota?: number | null;
  refquota_warning?: number | string;
  refquota_critical?: number | string;
  reservation?: number;
  refreservation?: number;
  special_small_block_size?: number;
  copies?: number;
  snapdir?: string;
  deduplication?: string;
  checksum?: string;
  readonly?: string;
  recordsize?: string;
  aclmode?: string;
  acltype?: string;
  share_type?: string;
  xattr?: string;
  user_properties?: { key: string; value: string }[];
}

export interface DatasetDeleteParams {
  recursive?: boolean;
  force?: boolean;
}

export interface DatasetQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions;
}

// ─── Snapshot ────────────────────────────────────────────────────────────────

export interface SnapshotEntry {
  id: string;
  name: string;
  dataset: string;
  snapshot_name: string;
  type: string;
  properties: Record<string, unknown>;
  holds: Record<string, string>;
  mountpoint: string | null;
}

export interface SnapshotCreateParams {
  dataset: string;
  name?: string;
  naming_schema?: string;
  recursive?: boolean;
  exclude?: string[];
  suspend_vms?: boolean;
  vmware_sync?: boolean;
}

export interface SnapshotDeleteParams {
  defer?: boolean;
  recursive?: boolean;
}

export interface SnapshotRollbackParams {
  recursive?: boolean;
  recursive_clones?: boolean;
  force?: boolean;
  recursive_rollback?: boolean;
}

export interface SnapshotQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions;
}
