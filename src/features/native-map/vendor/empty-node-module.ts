// sql.js 1.13 keeps Node-only requires behind a runtime environment check.
// Browser bundles never execute that branch; this shim only lets Turbopack resolve it.
const emptyNodeModule = {};

export default emptyNodeModule;
