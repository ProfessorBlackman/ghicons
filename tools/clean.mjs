#!/usr/bin/env node
/**
 * Removes every generated artifact, so the next `pnpm run generate` starts
 * from nothing. Useful when checking that generation is reproducible.
 */

import fs from 'node:fs';
import { fromRoot } from './canonical.mjs';

const GENERATED = [
    'packages/core/svg',
    'packages/core/registry.json',
    'packages/core/index.js',
    'packages/core/index.cjs',
    'packages/core/index.d.ts',
    'packages/react/src/icons',
    'packages/react/src/index.ts',
    'packages/react/stories',
    'packages/react/dist',
    'storybook-static',
];

for (const name of GENERATED) {
    const target = fromRoot(name);
    if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
        console.log(`removed ${name}`);
    }
}
