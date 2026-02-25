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

  async sendRequest(method: string, params?: any, timeoutMs = 30000): Promise<JSONRPCResponse> {
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

  private request(id: number, method: string, params?: any): JSONRPCRequest {
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

export interface JSONRPCRequest {
  jsonrpc: "2.0";
  method: string;
  params?: any;
  id: number | string ;
}

export interface JSONRPCResponse {
  jsonrpc: "2.0";
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: number | string;
}
