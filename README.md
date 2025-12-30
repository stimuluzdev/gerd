# GERD!

## Installation

### Quick Install (requires [Deno](https://deno.land))

**macOS / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/stimuluzdev/gerd/main/install.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/stimuluzdev/gerd/main/install.ps1 | iex
```

### From Source (for development)

```bash
git clone https://github.com/stimuluzdev/gerd.git
cd gerd/cli
deno install
deno task up:gerd
```

To remove: `deno task un:gerd`

---

## Command Line Interface [CLI]

To test in development use the command `deno task dev` after you change
directory into the cli directory

Make sure to run the command `deno install` before you proceed

[CLI Flow Documentation](docs/content/docs/cli-flow.mdx)

## Documentation

This is a docs application generated with
[Fumadocs](https://github.com/fuma-nama/fumadocs)

Run development server:

```bash
cd docs
pnpm install
pnpm dev
```

Open http://localhost:3000
