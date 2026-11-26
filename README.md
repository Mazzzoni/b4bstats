# B4BSTATS

A Back 4 Blood statistics website with player profiles, leaderboards, save analysis, and weapon references.

## Stack

- Next.js 16, React 19, and TypeScript
- Mantine 9 and Tailwind CSS 4
- Jotai for state management
- Chart.js 4 for graphs
- i18next for translations
- Node.js 24 and pnpm

## Operations

The server standard and the host config (Caddy site, firewall) are in
[Mazzzoni/mazz-infra](https://github.com/Mazzzoni/mazz-infra); this project's row is in its `inventory.toml`.
The API is a separate repository, Mazzzoni/b4bstats-api (b4bstats-api.mazz.lol).

### Environments

| Env | Server (ssh alias) | Domain | Checkout | Branch | Compose project |
| --- | --- | --- | --- | --- | --- |
| production | `mazzvps` | b4bstats.mazz.lol | `~/projects/b4bstats.mazz.lol` | `main` | `b4bstatsmazzlol` |

One container, `web` (Next.js, `127.0.0.1:8487`). `compose.yaml` is the base; the server's `.env` adds
`compose.prod.yaml` (restart policy, log rotation) through `COMPOSE_FILE` and pins `COMPOSE_PROJECT_NAME`.

### Deploy

By hand on the server, after a push to `main`:

```bash
cd ~/projects/b4bstats.mazz.lol && git pull --ff-only && docker compose up -d --build --wait
```

### Rollback

Revert the commit on `main`, push, deploy as above.

### Server files

| Path | What | Template |
| --- | --- | --- |
| `.env` | compose: `COMPOSE_FILE`, project name, port (no secret) | `.env.prod.dist` |
| `.env.local` | the site's settings: Plausible, the API URL and the proxy's shared token | `.env.local.prod.dist` |

Both are in Bitwarden (Mazz/Servers) through `~/projects/server-secrets`.

### Backup and restore

Nothing to back up: no database (the data is the API's).

### Logs and jobs

No cron, no worker. Logs: `docker compose logs -f web`.

## Credits

Created by [Mazzoni](https://github.com/Mazzzoni). (email: [hello@mazz.lol](mailto:hello@mazz.lol) / discord: [@mazz#0385](https://discordapp.com/users/370123066594033668))
Thanks to [r/Back4Blood/](https://www.reddit.com/r/Back4Blood/) and [Turtle Rock Studios](https://turtlerockstudios.com/) for their support and contributions.
