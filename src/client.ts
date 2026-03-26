import type {
  TrueNASMethod,
  MethodParams,
  MethodResult,
} from "./types/index.js";

export interface JSONRPCRequest {
  jsonrpc: "2.0";
  method: string;
  params?: unknown[];
  id: number | string;
}

export interface JSONRPCResponse<R = unknown> {
  jsonrpc: "2.0";
  result?: R;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: number | string;
}

export default class TrueNASClient {

  private wsURL: string;
  private apiKey: string;

  constructor(wsURL: string, apiKey: string) {
    const url = new URL(wsURL);
    if(url.protocol !== "wss:" && url.protocol !== "ws:")
      throw new Error("Invalid url protocol. Expect wss: or ws:")
    this.wsURL = wsURL;
    this.apiKey = apiKey;
  }

  /**
   * Send a type-safe JSON-RPC request to the TrueNAS WebSocket API.
   *
   * Method names, parameters, and return types are fully checked at compile time.
   * For methods not yet in the type map, use `sendRawRequest` instead.
   */
  async sendRequest<M extends TrueNASMethod>(
    method: M,
    ...args: SendRequestArgs<M>
  ): Promise<JSONRPCResponse<MethodResult<M>>> {
    const [params, timeoutMs] = resolveArgs(args);
    return this.executeRequest(method, params, timeoutMs) as Promise<JSONRPCResponse<MethodResult<M>>>;
  }

  /**
   * Send an untyped JSON-RPC request. Use this for methods not yet in the type map.
   */
  async sendRawRequest(
    method: string,
    params?: unknown[],
    timeoutMs?: number,
  ): Promise<JSONRPCResponse> {
    return this.executeRequest(method, params, timeoutMs ?? 30000);
  }

  private async executeRequest(
    method: string,
    params: unknown[] | undefined,
    timeoutMs: number,
  ): Promise<JSONRPCResponse> {
    let id = 0;
    const socket = new WebSocket(this.wsURL);
    try {
      const authRequest: JSONRPCRequest = this.request(id++, "auth.login_with_api_key", [this.apiKey]);
      const apiRequest: JSONRPCRequest = this.request(id++, method, params);
      const authResponse: JSONRPCResponse = await this.call(socket, authRequest, timeoutMs);

      if(authResponse.result !== true) {
        throw new Error("Authentication failed");
      }

      return await this.call(socket, apiRequest, timeoutMs);
    } finally {
      socket.close();
    }
  }

  private request(id: number, method: string, params?: unknown[]): JSONRPCRequest {
    return  {
      jsonrpc: "2.0",
      method,
      params: params ?? [],
      id: id
    };
  }

  private async parseMessageData(data: unknown): Promise<string> {
    if (typeof data === "string") return data;
    if (data instanceof Blob) return await data.text();
    if (data instanceof ArrayBuffer) return new TextDecoder().decode(data);
    return String(data);
  }

  private call(socket: WebSocket, req: JSONRPCRequest, timeoutMs: number): Promise<JSONRPCResponse> {
    return new Promise((resolve, reject) => {

      const cleanup = () => {
        clearTimeout(timer);
        socket.removeEventListener("message", onMessage);
        socket.removeEventListener("error", onError);
        socket.removeEventListener("close", onClose);
        socket.removeEventListener("open", onOpen);
      };

      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Request timed out for id ${req.id}`));
      }, timeoutMs);

      const onMessage = async (event: MessageEvent) => {
        try {
          const raw = await this.parseMessageData(event.data);
          const response: JSONRPCResponse = JSON.parse(raw);
          if (response.id === req.id) {
            cleanup();
            resolve(response);
          }
        } catch (error: unknown) {
          cleanup();
          reject(new Error(`Error parsing response for id ${req.id}: ${String(error)}`));
        }
      };

      const onError = (event: Event) => {
        cleanup();
        reject(new Error(`WebSocket error ${event}`));
      }

      const onClose = (event: CloseEvent) => {
        cleanup();
        reject(new Error(`WebSocket closed before response received (code: ${event.code})`));
      }

      const onOpen =  () => {
          socket.send(JSON.stringify(req));
      }

      socket.addEventListener("message", onMessage);
      socket.addEventListener("error", onError);
      socket.addEventListener("close", onClose);

      if(socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(req));
      }else {
        socket.addEventListener("open", onOpen);
      }
    });
  }

}

/**
 * Helper type: converts the method's params tuple into sendRequest arguments.
 * - If params is [], only an optional timeoutMs is accepted.
 * - If all params are optional, params array is also optional.
 * - Otherwise, params array is required + optional timeoutMs.
 */
type SendRequestArgs<M extends TrueNASMethod> =
  MethodParams<M> extends []
    ? [timeoutMs?: number]
    : [] extends MethodParams<M>
      ? [params?: MethodParams<M>, timeoutMs?: number]
      : [params: MethodParams<M>, timeoutMs?: number];

/** Resolve the variadic args into [params, timeoutMs] */
function resolveArgs(args: unknown[]): [unknown[] | undefined, number] {
  const first = args[0];
  const second = args[1];

  if (args.length === 0) {
    return [undefined, 30000];
  }
  if (typeof first === "number") {
    return [undefined, first];
  }
  return [first as unknown[] | undefined, typeof second === "number" ? second : 30000];
}
