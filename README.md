# Orgasmic plugins

The official Orgasmic plugin marketplace. `marketplace.org` lists every
plugin. An entry's `:SOURCE:` is a folder in this repo or a git URL.

Add this marketplace in the Orgasmic app (Plugins → Marketplaces) or:

```sh
orgasmic marketplace add https://github.com/theaspirational/orgasmic-plugins
orgasmic plugin add orgasmic-plugins/meetings
```

Each plugin folder holds a `plugin.org` manifest and its own README.

## Tests

Plugins ship as plain ESM and need no build. Their tests run from the repo root:

```sh
npm install
npm test
```

`test/plugin-sdk.js` stands in for the host's `@orgasmic/plugin-sdk`, which the
Orgasmic app supplies at runtime. A plugin that needs more of the SDK adds it
there rather than mocking it per test.
