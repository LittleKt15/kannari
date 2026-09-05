# Dependency trust exceptions

Reviewed on 2026-09-04. These four existing locked releases lack npm provenance
attestations and trigger pnpm's `no-downgrade` trust policy. The exceptions apply
only to the exact versions listed in `pnpm-workspace.yaml`; the 24-hour release
age, trust checks for other versions, and build-script allowlist remain enabled.

| Package | Reason for retaining it | Upstream evidence |
| --- | --- | --- |
| eslint-import-resolver-typescript@3.10.1 | Next.js ESLint configuration requires the v3 release line. | [Official release](https://github.com/import-js/eslint-import-resolver-typescript/releases/tag/v3.10.1) documents an unrs-resolver update; npm gitHead matches the release commit. |
| pino@9.14.0 | Payload 3.88.0 pins this version. | [Official release](https://github.com/pinojs/pino/releases/tag/v9.14.0) documents v9 changes, including the redact update; npm gitHead matches the release commit. |
| semver@6.3.1 | Babel and ESLint dependencies require v6. | [Official release](https://github.com/npm/node-semver/releases/tag/v6.3.1); [CVE-2022-25883 advisory](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw) identifies 6.3.1 as patched. |
| undici-types@6.21.0 | Node 22 type definitions require ~6.21.0. | [Upstream issue](https://github.com/nodejs/undici/issues/4666) documents missing provenance for this types-only package. |

## Checks and limits

- Queried npm's bulk advisory endpoint for these four exact versions; it returned
  no advisories at review time. This was not a full dependency-tree audit.
- Compared each published SHA-512 integrity value with `pnpm-lock.yaml`; all match.
- Published manifests contain no preinstall, install, or postinstall scripts for
  these four releases. Transitive dependencies remain subject to existing policies.
- This is a release-history and advisory review, not a complete source audit or
  cryptographic verification that the npm artifacts were built from upstream code.
  Missing provenance remains unresolved, and absence of advisories is not proof
  of safety. Matching checksums establish consistency with registry metadata only.

Do not broaden these selectors to package-wide exclusions. Re-check advisories
and remove exceptions when supported parent updates no longer need these releases.
Keep the lockfile committed and use `pnpm install --frozen-lockfile` in CI.
