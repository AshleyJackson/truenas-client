# truenas-client

A lightweight TypeScript client for interacting with the [TrueNAS WebSocket API](https://api.truenas.com/v25.10/jsonrpc.html) using JSON-RPC 2.0.

## Installation

```sh
npm install truenas-client
```

> **Note:** Requires Node.js >= 21 (for native `WebSocket` support).

## Usage

### Setup

```ts
import { TrueNASClient } from "truenas-client";

const client = new TrueNASClient("wss://your-truenas-host/websocket", "your-api-key");
```

### Single Request

Use `sendRequest` to send a single API call. The client handles authentication automatically before forwarding your request.

```ts
const response = await client.sendRequest("system.info");
console.log(response.result);
```

You can also pass parameters:

```ts
const response = await client.sendRequest("pool.dataset.query", [[], { limit: 10 }]);
console.log(response.result);
```

### Error Handling

Each response may include an `error` object instead of a `result`. Always check for errors:

```ts
const response = await client.sendRequest("system.info");

if (response.error) {
  console.error(`Error ${response.error.code}: ${response.error.message}`);
} else {
  console.log(response.result);
}
```

Requests will reject with an `Error` in the following cases:

- **Authentication failure** — invalid API key or denied access.
- **Timeout** — no response received within 30 seconds (default).
- **WebSocket error** — connection-level error.
- **WebSocket closed** — server closes the connection before a response is received.

## API

### `new TrueNASClient(wsURL: string, apiKey: string)`

Creates a new client instance.

| Parameter | Type     | Description                                                                     |
| --------- | -------- | ------------------------------------------------------------------------------- |
| `wsURL`   | `string` | The WebSocket URL of your TrueNAS server (e.g. `ws://192.168.1.100/websocket`) |
| `apiKey`  | `string` | A TrueNAS API key for authentication                                           |

> For TrueNAS servers with HTTPS enabled, use `wss://` instead of `ws://`.

### `client.sendRequest(method: string, params?: any, timeoutMs?: number): Promise<JSONRPCResponse>`

Sends a single JSON-RPC 2.0 request. Opens a WebSocket connection, authenticates with the provided API key, sends the request, and closes the connection.

| Parameter   | Type     | Default | Description                                              |
| ----------- | -------- | ------- | -------------------------------------------------------- |
| `method`    | `string` | —       | The JSON-RPC method to call (e.g. `"system.info"`)      |
| `params`    | `any`    | —       | Optional parameters to pass with the request             |
| `timeoutMs` | `number` | `30000` | Timeout in milliseconds for each underlying WebSocket call (auth + request) |

### Types

#### `JSONRPCRequest`

```ts
interface JSONRPCRequest {
  jsonrpc: "2.0";
  method: string;
  params?: any;
  id: number | string;
}
```

#### `JSONRPCResponse`

```ts
interface JSONRPCResponse {
  jsonrpc: "2.0";
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: number | string;
}
```

The `result` field is typed as `any` to match the [TrueNAS JSON-RPC API](https://api.truenas.com/v25.10/jsonrpc.html), which returns varied response shapes depending on the method called.

## Security

Never hardcode your API key. Use environment variables:

```ts
const client = new TrueNASClient(
  process.env.TRUENAS_URL!,
  process.env.TRUENAS_API_KEY!
);
```

## How It Works

1. A new WebSocket connection is opened to the TrueNAS server.
2. The client authenticates using `auth.login_with_api_key` with your API key.
3. If authentication succeeds, your request is sent over the same connection.
4. The connection is closed after the response is received.

Each call to `sendRequest` opens and closes its own WebSocket connection.

## Building

```sh
npm run build
```

This compiles the TypeScript source from `src/` into JavaScript in `dist/` using [tsup](https://tsup.egoist.dev/), producing both ESM and CJS outputs with type declarations.

## License

[ISC](LICENSE) © Daury Guzman <me@dauryguzman.com>