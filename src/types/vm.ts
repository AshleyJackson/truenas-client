/**
 * Type definitions for the TrueNAS `vm` namespace.
 * TrueNAS API v25.10
 */

import type { QueryFilter, QueryOptions } from "./common.js";

export type VMCpuMode = "CUSTOM" | "HOST-MODEL" | "HOST-PASSTHROUGH";
export type VMBootloader = "UEFI" | "UEFI_CSM";
export type VMTimeType = "LOCAL" | "UTC";
export type VMStateType = "RUNNING" | "STOPPED" | "SUSPENDED";

export type VMDeviceType = "CDROM" | "DISPLAY" | "NIC" | "PCI" | "RAW" | "DISK" | "USB";

export type DisplayResolution =
  | "1920x1200" | "1920x1080" | "1600x1200" | "1600x900"
  | "1400x1050" | "1280x1024" | "1280x720" | "1024x768"
  | "800x600" | "640x480";

export type DisplayType = "SPICE" | "VNC";
export type NICType = "E1000" | "VIRTIO";
export type DiskBusType = "AHCI" | "VIRTIO";
export type IOType = "NATIVE" | "THREADS" | "IO_URING";
export type SectorSize = null | 512 | 4096;

export type USBControllerType =
  | "piix3-uhci" | "piix4-uhci" | "ehci" | "ich9-ehci1"
  | "vt82c686b-uhci" | "pci-ohci" | "nec-xhci" | "qemu-xhci";

export interface VMDeviceEntry {
  id: number;
  vm: number;
  order: number;
  dtype: VMDeviceType;
  attributes: Record<string, unknown>;
}

export interface VMStatus {
  state: VMStateType;
  pid: number | null;
  domain_state: string;
}

export interface VMEntry {
  id: number;
  name: string;
  description: string;
  command_line_args: string;
  cpu_mode: VMCpuMode;
  cpu_model: string | null;
  vcpus: number;
  cores: number;
  threads: number;
  cpuset: string | null;
  nodeset: string | null;
  enable_cpu_topology_extension: boolean;
  pin_vcpus: boolean;
  suspend_on_snapshot: boolean;
  trusted_platform_module: boolean;
  memory: number;
  min_memory: number | null;
  hyperv_enlightenments: boolean;
  bootloader: VMBootloader;
  bootloader_ovmf: string;
  autostart: boolean;
  hide_from_msr: boolean;
  ensure_display_device: boolean;
  time: VMTimeType;
  shutdown_timeout: number;
  arch_type: string | null;
  machine_type: string | null;
  uuid: string | null;
  enable_secure_boot: boolean;
  devices: VMDeviceEntry[];
  status: VMStatus;
  display_available: boolean;
}

export interface VMCreateParams {
  name: string;
  memory: number;
  description?: string;
  vcpus?: number;
  cores?: number;
  threads?: number;
  cpu_mode?: VMCpuMode;
  cpu_model?: string | null;
  cpuset?: string | null;
  nodeset?: string | null;
  pin_vcpus?: boolean;
  enable_cpu_topology_extension?: boolean;
  min_memory?: number | null;
  hyperv_enlightenments?: boolean;
  bootloader?: VMBootloader;
  bootloader_ovmf?: string | null;
  enable_secure_boot?: boolean;
  autostart?: boolean;
  time?: VMTimeType;
  shutdown_timeout?: number;
  arch_type?: string | null;
  machine_type?: string | null;
  uuid?: string | null;
  trusted_platform_module?: boolean;
  hide_from_msr?: boolean;
  ensure_display_device?: boolean;
  suspend_on_snapshot?: boolean;
  command_line_args?: string;
}

export interface VMUpdateParams {
  name?: string;
  memory?: number;
  description?: string;
  vcpus?: number;
  cores?: number;
  threads?: number;
  cpu_mode?: VMCpuMode;
  cpu_model?: string | null;
  cpuset?: string | null;
  nodeset?: string | null;
  pin_vcpus?: boolean;
  enable_cpu_topology_extension?: boolean;
  min_memory?: number | null;
  hyperv_enlightenments?: boolean;
  bootloader?: VMBootloader;
  bootloader_ovmf?: string | null;
  enable_secure_boot?: boolean;
  autostart?: boolean;
  time?: VMTimeType;
  shutdown_timeout?: number;
  arch_type?: string | null;
  machine_type?: string | null;
  uuid?: string | null;
  trusted_platform_module?: boolean;
  hide_from_msr?: boolean;
  ensure_display_device?: boolean;
  suspend_on_snapshot?: boolean;
  command_line_args?: string;
}

export interface VMDeleteOptions {
  zvols?: boolean;
  force?: boolean;
}

export interface VMStartOptions {
  overcommit?: boolean;
}

export interface VMStopOptions {
  force?: boolean;
  force_after_timeout?: boolean;
}

export interface VMQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions;
}
