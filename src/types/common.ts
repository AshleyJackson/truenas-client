/**
 * Common types shared across TrueNAS API namespaces.
 * TrueNAS API v25.10
 */

/** Standard query filters used by all .query() methods */
export type QueryFilter = unknown[];

/** Standard query options used by all .query() and .get_instance() methods */
export interface QueryOptions {
  extra?: Record<string, unknown>;
  order_by?: string[];
  select?: unknown[];
  count?: boolean;
  get?: boolean;
  offset?: integer;
  limit?: integer;
  force_sql_filters?: boolean;
}

/** Alias for documentation clarity */
export type integer = number;

/** ISO 8601 datetime string */
export type DateTimeString = string;
