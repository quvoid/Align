// Vitest stand-in for the `server-only` marker package, which Next resolves
// itself and which isn't installed as a dependency. Importing it in tests is a
// no-op, exactly as it is in a server bundle.
export {};
