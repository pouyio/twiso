// `moduleResolution: node` cannot resolve the `vitest/browser` export map, so
// re-export the installed browser types for the non-deprecated entry point.
declare module 'vitest/browser' {
  export * from '@vitest/browser/context';
}
