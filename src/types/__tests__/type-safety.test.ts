/**
 * Compile-time type safety tests.
 * This file is never executed — it only needs to type-check.
 * Run: npx tsc --noEmit
 */

import type { TrueNASClient } from "../../index.js";
import type { SystemInfo, UserEntry, PoolEntry, VMEntry, VMStatus, SharingNFSEntry, SharingSMBEntry, GroupEntry, ServiceEntry, AuthMeResult, DatasetEntry, SnapshotEntry } from "../index.js";

declare const client: TrueNASClient;

// ── No-param methods return correct types ──────────────────────────────────

async function testNoParamMethods() {
  const info = await client.sendRequest("system.info");
  //    ^? JSONRPCResponse<SystemInfo>
  const _version: string | undefined = info.result?.hostname;

  const state = await client.sendRequest("system.state");
  //    ^? JSONRPCResponse<"BOOTING" | "READY" | "SHUTTING_DOWN">
  const _s: "BOOTING" | "READY" | "SHUTTING_DOWN" | undefined = state.result;

  const ready = await client.sendRequest("system.ready");
  const _b: boolean | undefined = ready.result;

  const me = await client.sendRequest("auth.me");
  const _name: string | undefined = me.result?.pw_name;
}

// ── Parameterized methods ──────────────────────────────────────────────────

async function testParamMethods() {
  // Query with filters
  const users = await client.sendRequest("user.query", [[], { limit: 10 }]);
  const _users: UserEntry[] | undefined = users.result;

  // Create requires correct shape
  const newUser = await client.sendRequest("user.create", [{
    username: "testuser",
    full_name: "Test User",
  }]);
  const _uid: number | undefined = newUser.result?.uid;

  // Update takes id + update object
  const updated = await client.sendRequest("user.update", [1, { email: "test@example.com" }]);
  const _updated: string | undefined = updated.result?.username;

  // Delete
  const deleted = await client.sendRequest("user.delete", [1, { delete_group: true }]);
  const _deleted: number | undefined = deleted.result;
}

// ── Pool methods ───────────────────────────────────────────────────────────

async function testPoolMethods() {
  const pools = await client.sendRequest("pool.query");
  const _pools: PoolEntry[] | undefined = pools.result;

  const datasets = await client.sendRequest("pool.dataset.query", [[], { limit: 5 }]);
  const _datasets: DatasetEntry[] | undefined = datasets.result;

  const snap = await client.sendRequest("pool.snapshot.create", [{
    dataset: "tank/data",
    name: "test-snap",
  }]);
  const _snap: SnapshotEntry | undefined = snap.result;
}

// ── VM methods ─────────────────────────────────────────────────────────────

async function testVMMethods() {
  const vms = await client.sendRequest("vm.query");
  const _vms: VMEntry[] | undefined = vms.result;

  const status = await client.sendRequest("vm.status", [1]);
  const _status: VMStatus | undefined = status.result;

  // Start with options
  await client.sendRequest("vm.start", [1, { overcommit: true }]);

  // Stop with options
  await client.sendRequest("vm.stop", [1, { force: true }]);
}

// ── Sharing methods ────────────────────────────────────────────────────────

async function testSharingMethods() {
  const nfs = await client.sendRequest("sharing.nfs.query");
  const _nfs: SharingNFSEntry[] | undefined = nfs.result;

  const smb = await client.sendRequest("sharing.smb.create", [{
    name: "myshare",
    path: "/mnt/tank/share",
  }]);
  const _smb: SharingSMBEntry | undefined = smb.result;
}

// ── Service methods ────────────────────────────────────────────────────────

async function testServiceMethods() {
  const services = await client.sendRequest("service.query");
  const _services: ServiceEntry[] | undefined = services.result;

  const started = await client.sendRequest("service.started", ["smb"]);
  const _started: boolean | undefined = started.result;

  await client.sendRequest("service.control", ["RESTART", "nfs"]);
}

// ── Timeout arg ────────────────────────────────────────────────────────────

async function testTimeout() {
  // No-param method with timeout
  await client.sendRequest("system.info", 5000);

  // Param method with timeout
  await client.sendRequest("user.query", [[], { limit: 10 }], 5000);
}

// ── Fallback for untyped methods ───────────────────────────────────────────

async function testFallback() {
  // Untyped methods use sendRawRequest
  const result = await client.sendRawRequest("some.custom.method", [1, 2, 3]);
  const _r: unknown = result.result;
}

// ── Type errors (uncomment to verify they fail) ────────────────────────────
// These should produce compile errors:
// await client.sendRequest("system.info", [1]);        // system.info takes no params
// await client.sendRequest("user.create", []);          // user.create requires params
// await client.sendRequest("vm.start", ["not-a-number"]); // id must be number
