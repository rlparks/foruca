# foruca

A classic form application, just like the old days. Supports boards, OpenID login, and threads (coming soon!).

## Built With

- [SvelteKit](https://kit.svelte.dev/)
- [PocketBase](https://pocketbase.io/)

## Getting started (Docker Compose)

Download the provided `compose.yaml` and `pb-Dockerfile` files and place them in the same directory. Configure the ports as you wish and set these environment variables:

```
PB_URL
PB_ADMIN_EMAIL
PB_ADMIN_PASSWORD
```

For security reasons, it is recommended to not provide the PocketBase container an outside port. To start the application, run:

```bash
docker compose up -d
```

foruca should now be accessible at `http://localhost:3000`!
