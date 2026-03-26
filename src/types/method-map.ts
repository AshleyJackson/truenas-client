/**
 * Master method map: maps every typed TrueNAS JSON-RPC method name to its
 * parameter tuple and result type.
 *
 * TrueNAS API v25.10
 *
 * The params type represents the JSON-RPC `params` array that gets sent
 * over the wire. Each entry in the tuple is one positional argument.
 */

import type { QueryFilter, QueryOptions } from "./common.js";
import type {
  SystemInfo,
  SystemState,
  SystemProductType,
  SystemShutdownParams,
  SystemRebootParams,
} from "./system.js";
import type {
  AuthMeResult,
  AuthSessionEntry,
  AuthGenerateTokenParams,
} from "./auth.js";
import type {
  ServiceEntry,
  ServiceControlVerb,
  ServiceControlParams,
  ServiceUpdateParams,
} from "./service.js";
import type {
  UserEntry,
  UserCreateParams,
  UserCreateResult,
  UserUpdateParams,
  UserDeleteOptions,
  UserGetUserObjParams,
  UserGetUserObjResult,
} from "./user.js";
import type {
  GroupEntry,
  GroupCreateParams,
  GroupUpdateParams,
  GroupDeleteOptions,
} from "./group.js";
import type {
  SharingNFSEntry,
  SharingNFSCreateParams,
  SharingNFSUpdateParams,
  SharingSMBEntry,
  SharingSMBCreateParams,
  SharingSMBUpdateParams,
} from "./sharing.js";
import type {
  VMEntry,
  VMCreateParams,
  VMUpdateParams,
  VMDeleteOptions,
  VMStartOptions,
  VMStopOptions,
  VMStatus,
} from "./vm.js";
import type {
  PoolEntry,
  PoolCreateParams,
  PoolUpdateParams,
  PoolExportParams,
  PoolImportParams,
  PoolAttachParams,
  DatasetEntry,
  DatasetCreateParams,
  DatasetUpdateParams,
  DatasetDeleteParams,
  SnapshotEntry,
  SnapshotCreateParams,
  SnapshotDeleteParams,
  SnapshotRollbackParams,
} from "./pool.js";

/**
 * Each key is a JSON-RPC method name.
 * `params` is the tuple of positional arguments (the JSON-RPC params array).
 * `result` is the type of the `result` field in a successful JSON-RPC response.
 */
export interface TrueNASMethodMap {
  // ── system ───────────────────────────────────────────────────────────────
  "system.info": { params: []; result: SystemInfo };
  "system.version": { params: []; result: string };
  "system.version_short": { params: []; result: string };
  "system.state": { params: []; result: SystemState };
  "system.ready": { params: []; result: boolean };
  "system.host_id": { params: []; result: string };
  "system.boot_id": { params: []; result: string };
  "system.product_type": { params: []; result: SystemProductType };
  "system.feature_enabled": { params: [feature: string]; result: boolean };
  "system.release_notes_url": { params: []; result: string };
  "system.reboot": {
    params: [reason: string, options?: { delay?: number | null }];
    result: null;
  };
  "system.shutdown": {
    params: [reason: string, options?: { delay?: number | null }];
    result: null;
  };

  // ── auth ─────────────────────────────────────────────────────────────────
  "auth.login_with_api_key": { params: [api_key: string]; result: boolean };
  "auth.login": {
    params: [username: string, password: string];
    result: boolean;
  };
  "auth.login_with_token": { params: [token: string]; result: boolean };
  "auth.logout": { params: []; result: boolean };
  "auth.me": { params: []; result: AuthMeResult };
  "auth.sessions": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: AuthSessionEntry[];
  };
  "auth.generate_token": {
    params: [
      ttl?: number | null,
      attrs?: Record<string, unknown>,
      match_origin?: boolean,
      single_use?: boolean,
    ];
    result: string;
  };
  "auth.generate_onetime_password": { params: []; result: string };
  "auth.terminate_session": { params: [id: string]; result: boolean };
  "auth.terminate_other_sessions": { params: []; result: boolean };
  "auth.set_attribute": {
    params: [key: string, value: unknown];
    result: boolean;
  };

  // ── service ──────────────────────────────────────────────────────────────
  "service.query": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: ServiceEntry[];
  };
  "service.get_instance": {
    params: [id: number, options?: QueryOptions];
    result: ServiceEntry;
  };
  "service.control": {
    params: [
      verb: ServiceControlVerb,
      service: string,
      options?: {
        ha_propagate?: boolean;
        silent?: boolean;
        timeout?: number | null;
      },
    ];
    result: boolean;
  };
  "service.update": {
    params: [id_or_name: number | string, service_update: { enable: boolean }];
    result: number;
  };
  "service.started": { params: [service: string]; result: boolean };
  "service.started_or_enabled": { params: [service: string]; result: boolean };

  // ── user ─────────────────────────────────────────────────────────────────
  "user.query": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: UserEntry[];
  };
  "user.get_instance": {
    params: [id: number, options?: QueryOptions];
    result: UserEntry;
  };
  "user.create": { params: [user_create: UserCreateParams]; result: UserCreateResult };
  "user.update": {
    params: [id: number, user_update: UserUpdateParams];
    result: UserCreateResult;
  };
  "user.delete": {
    params: [id: number, options?: UserDeleteOptions];
    result: number;
  };
  "user.get_user_obj": {
    params: [params: UserGetUserObjParams];
    result: UserGetUserObjResult;
  };
  "user.shell_choices": {
    params: [group_ids?: number[]];
    result: Record<string, string>;
  };
  "user.get_next_uid": { params: []; result: number };
  "user.has_local_administrator_set_up": { params: []; result: boolean };

  // ── group ────────────────────────────────────────────────────────────────
  "group.query": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: GroupEntry[];
  };
  "group.get_instance": {
    params: [id: number, options?: QueryOptions];
    result: GroupEntry;
  };
  "group.create": { params: [group_create: GroupCreateParams]; result: number };
  "group.update": {
    params: [id: number, group_update: GroupUpdateParams];
    result: number;
  };
  "group.delete": {
    params: [id: number, options?: GroupDeleteOptions];
    result: number;
  };
  "group.get_group_obj": {
    params: [name: string];
    result: Record<string, unknown>;
  };
  "group.get_next_gid": { params: []; result: number };
  "group.has_password_enabled_user": { params: [id: number]; result: boolean };

  // ── sharing.nfs ──────────────────────────────────────────────────────────
  "sharing.nfs.query": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: SharingNFSEntry[];
  };
  "sharing.nfs.get_instance": {
    params: [id: number, options?: QueryOptions];
    result: SharingNFSEntry;
  };
  "sharing.nfs.create": {
    params: [nfs_create: SharingNFSCreateParams];
    result: SharingNFSEntry;
  };
  "sharing.nfs.update": {
    params: [id: number, nfs_update: SharingNFSUpdateParams];
    result: SharingNFSEntry;
  };
  "sharing.nfs.delete": { params: [id: number]; result: boolean };

  // ── sharing.smb ──────────────────────────────────────────────────────────
  "sharing.smb.query": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: SharingSMBEntry[];
  };
  "sharing.smb.get_instance": {
    params: [id: number, options?: QueryOptions];
    result: SharingSMBEntry;
  };
  "sharing.smb.create": {
    params: [smb_create: SharingSMBCreateParams];
    result: SharingSMBEntry;
  };
  "sharing.smb.update": {
    params: [id: number, smb_update: SharingSMBUpdateParams];
    result: SharingSMBEntry;
  };
  "sharing.smb.delete": { params: [id: number]; result: boolean };

  // ── pool ─────────────────────────────────────────────────────────────────
  "pool.query": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: PoolEntry[];
  };
  "pool.get_instance": {
    params: [id: number, options?: QueryOptions];
    result: PoolEntry;
  };
  "pool.create": { params: [pool_create: PoolCreateParams]; result: PoolEntry };
  "pool.update": {
    params: [id: number, pool_update: PoolUpdateParams];
    result: PoolEntry;
  };
  "pool.export": {
    params: [id: number, options?: PoolExportParams];
    result: null;
  };
  "pool.import_pool": {
    params: [pool_import: PoolImportParams];
    result: PoolEntry;
  };
  "pool.get_disks": { params: [id: number]; result: string[] };
  "pool.attach": {
    params: [id: number, attach_params: PoolAttachParams];
    result: null;
  };
  "pool.detach": { params: [id: number, label: string]; result: null };
  "pool.scrub": { params: [id: number]; result: null };
  "pool.import_find": { params: []; result: Record<string, unknown>[] };
  "pool.is_upgraded": { params: [id: number]; result: boolean };
  "pool.upgrade": { params: [id: number]; result: null };
  "pool.validate_name": {
    params: [name: string];
    result: Record<string, unknown>;
  };

  // ── pool.dataset ─────────────────────────────────────────────────────────
  "pool.dataset.query": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: DatasetEntry[];
  };
  "pool.dataset.get_instance": {
    params: [id: string, options?: QueryOptions];
    result: DatasetEntry;
  };
  "pool.dataset.create": {
    params: [dataset_create: DatasetCreateParams];
    result: DatasetEntry;
  };
  "pool.dataset.update": {
    params: [id: string, dataset_update: DatasetUpdateParams];
    result: DatasetEntry;
  };
  "pool.dataset.delete": {
    params: [id: string, options?: DatasetDeleteParams];
    result: boolean;
  };
  "pool.dataset.compression_choices": {
    params: [];
    result: Record<string, string>;
  };
  "pool.dataset.checksum_choices": {
    params: [];
    result: Record<string, string>;
  };
  "pool.dataset.encryption_algorithm_choices": {
    params: [];
    result: Record<string, string>;
  };
  "pool.dataset.recordsize_choices": {
    params: [];
    result: Record<string, string>;
  };
  "pool.dataset.lock": { params: [id: string]; result: boolean };
  "pool.dataset.unlock": {
    params: [
      id: string,
      options?: {
        key?: string;
        passphrase?: string;
        recursive?: boolean;
        toggle_attachments?: boolean;
      },
    ];
    result: Record<string, unknown>;
  };
  "pool.dataset.promote": { params: [id: string]; result: null };
  "pool.dataset.snapshot_count": { params: [id: string]; result: number };
  "pool.dataset.export_key": { params: [id: string]; result: string };

  // ── pool.snapshot ────────────────────────────────────────────────────────
  "pool.snapshot.query": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: SnapshotEntry[];
  };
  "pool.snapshot.get_instance": {
    params: [id: string, options?: QueryOptions];
    result: SnapshotEntry;
  };
  "pool.snapshot.create": {
    params: [snapshot_create: SnapshotCreateParams];
    result: SnapshotEntry;
  };
  "pool.snapshot.delete": {
    params: [id: string, options?: SnapshotDeleteParams];
    result: boolean;
  };
  "pool.snapshot.rollback": {
    params: [id: string, options?: SnapshotRollbackParams];
    result: null;
  };
  "pool.snapshot.hold": { params: [id: string]; result: boolean };
  "pool.snapshot.release": { params: [id: string]; result: boolean };

  // ── vm ───────────────────────────────────────────────────────────────────
  "vm.query": {
    params: [filters?: QueryFilter, options?: QueryOptions];
    result: VMEntry[];
  };
  "vm.get_instance": {
    params: [id: number, options?: QueryOptions];
    result: VMEntry;
  };
  "vm.create": { params: [vm_create: VMCreateParams]; result: VMEntry };
  "vm.update": {
    params: [id: number, vm_update: VMUpdateParams];
    result: VMEntry;
  };
  "vm.delete": {
    params: [id: number, options?: VMDeleteOptions];
    result: boolean;
  };
  "vm.start": {
    params: [id: number, options?: VMStartOptions];
    result: null;
  };
  "vm.stop": {
    params: [id: number, options?: VMStopOptions];
    result: null;
  };
  "vm.restart": { params: [id: number]; result: null };
  "vm.status": { params: [id: number]; result: VMStatus };
  "vm.get_available_memory": { params: []; result: number };
  "vm.supports_virtualization": { params: []; result: boolean };
  "vm.maximum_supported_vcpus": { params: []; result: number };
  "vm.random_mac": { params: []; result: string };
  "vm.bootloader_options": { params: []; result: string[] };
  "vm.cpu_model_choices": { params: []; result: Record<string, string> };
  "vm.resolution_choices": { params: []; result: Record<string, string> };
}

/** Union of all typed method names */
export type TrueNASMethod = keyof TrueNASMethodMap;

/** Extract the params tuple for a given method */
export type MethodParams<M extends TrueNASMethod> = TrueNASMethodMap[M]["params"];

/** Extract the result type for a given method */
export type MethodResult<M extends TrueNASMethod> = TrueNASMethodMap[M]["result"];
