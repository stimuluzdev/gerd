# GERD!

## Command Line Interface [CLI]

To test in development use the command `deno task dev` after you change directory into the
cli directory

Make sure to run the command `deno install` before you proceed

To install it globallly and get access to the `gerd` command in your cli, follow the steps
below:

```bash
cd cli
deno install
deno task i:gerd
```

To remove global installation run `deno task un:gerd`

To make your local changes reflect in the global installation run `deno task up:gerd`

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
