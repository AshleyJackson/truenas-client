/**
 * Type definitions for the TrueNAS `system` namespace.
 * TrueNAS API v25.10
 */

export interface SystemInfo {
  version: string;
  buildtime: string;
  hostname: string;
  physmem: number;
  model: string;
  cores: number;
  physical_cores: number;
  loadavg: [number, number, number];
  uptime: string;
  uptime_seconds: number;
  system_serial: string | null;
  system_product: string | null;
  system_product_version: string | null;
  license: Record<string, unknown> | null;
  boottime: string;
  datetime: string;
  timezone: string;
  system_manufacturer: string | null;
  ecc_memory: boolean;
}

export type SystemState = "BOOTING" | "READY" | "SHUTTING_DOWN";

export type SystemProductType = "COMMUNITY_EDITION" | "ENTERPRISE";

export interface SystemShutdownParams {
  reason: string;
  options?: {
    delay?: number | null;
  };
}

export interface SystemRebootParams {
  reason: string;
  options?: {
    delay?: number | null;
  };
}
