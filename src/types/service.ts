/**
 * Type definitions for the TrueNAS `service` namespace.
 * TrueNAS API v25.10
 */

import type { QueryFilter, QueryOptions } from "./common.js";

export interface ServiceEntry {
  id: number;
  service: string;
  enable: boolean;
  state: string;
  pids: number[];
}

export interface ServiceQueryParams {
  filters?: QueryFilter;
  options?: QueryOptions & {
    extra?: {
      include_state?: boolean;
    };
  };
}

export type ServiceControlVerb = "START" | "STOP" | "RESTART" | "RELOAD";

export interface ServiceControlParams {
  verb: ServiceControlVerb;
  service: string;
  options?: {
    ha_propagate?: boolean;
    silent?: boolean;
    timeout?: number | null;
  };
}

export interface ServiceUpdateParams {
  id_or_name: number | string;
  service_update: {
    enable: boolean;
  };
}
