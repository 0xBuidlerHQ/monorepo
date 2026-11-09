# Local IPFS

A local-only IPFS service built with Helia and UnixFS in TypeScript. No Kubo executable, Docker, public peer connections, or external pinning account is required. Files receive real CIDv1 content addresses and are recursively pinned to filesystem-backed storage.

## Run

From the repository root:

```sh
pnpm --filter @0xhq/ipfs dev
```

Root `pnpm dev` also starts the service through Turbo. It listens at **http://localhost:3003**, bound to `127.0.0.1`. Settings can go in `services/ipfs/.env.local`; see `.env.example`. Stored blocks and pins live in `services/ipfs/.data/`, ignored by Git. One process should own this data directory.

## Upload an image

```sh
curl http://localhost:3003/api/uploads \
  -H 'Content-Type: image/webp' \
  -H 'X-File-Name: front.webp' \
  --data-binary @front.webp
```

Uploads use the raw file body, not multipart/form-data. The filename is optional (`metadata.json` for JSON; `file.<extension>` otherwise). For filenames with spaces or non-ASCII characters, URL-encode the `X-File-Name` header.

The response includes:

```json
{
  "cid": "bafy…",
  "name": "front.webp",
  "size": 12345,
  "contentType": "image/webp",
  "uri": "ipfs://bafy…/front.webp",
  "gatewayUrl": "http://localhost:3003/ipfs/bafy…/front.webp"
}
```

The CID identifies a real UnixFS directory containing the named file. The same bytes, filename, and import settings produce the same CID. Changing the name changes the directory CID. Repeated uploads are safe.

## Upload metadata

Put the returned image `uri` in your metadata JSON, then upload it:

```sh
curl http://localhost:3003/api/uploads \
  -H 'Content-Type: application/json' \
  -H 'X-File-Name: metadata.json' \
  --data-binary @metadata.json
```

Store the returned `ipfs://…/metadata.json` URI in the NFT, rather than a localhost HTTP address. `GET /ipfs/{cid}/{filename}` and `HEAD` retrieve the local file. The gateway supports MIME types, immutable caching, and ETags. Missing local content returns 404; it never searches public gateways. Directory listings are not implemented. `GET /health` reports readiness.

Uploads accept JSON, PNG, JPEG, WebP, GIF, AVIF, and PDF with matching filename extensions. The default limit is 25 MiB per file. JSON is validated before import. Browser uploads are allowed only from the configured admin origin; backend calls and curl need no Origin header. This is a development service without production authentication; it is not a public upload gateway.

## App configuration

Both apps expose `resolveIpfsUri(uri)` in `src/config/ipfs.ts`, using `NEXT_PUBLIC_IPFS_GATEWAY_URL`. During development it defaults to `http://localhost:3003/ipfs/`. Admin backend uploads can use `IPFS_API_URL=http://localhost:3003`. Upload UI and passport minting are not connected yet.

For a deployed application, configure its public gateway and authenticated upload provider. Local CIDs are valid IPFS identifiers, but their content is not available through public gateways until it has been imported/pinned on a reachable provider. Export or re-import using the same UnixFS settings to preserve the CIDs; copy the entire data directory when backing up this service.

## Checks

```sh
pnpm --filter @0xhq/ipfs lint
pnpm --filter @0xhq/ipfs typecheck
pnpm --filter @0xhq/ipfs test
```

Integration tests cover image and multi-block metadata retrieval after restart, deterministic duplicate uploads, HEAD/ETag behavior, and rejected uploads.
