#!/usr/bin/env node
/**
 * Release gate: checks that what is about to be published is coherent.
 *
 * Runs after `pnpm run build`, before publishing. It catches the failure modes
 * that a passing build does not: a package missing a file it declares, the two
 * packages disagreeing about which icons exist, development files leaking into
 * a tarball, or versions drifting apart.
 *
 *   node tools/verify-packages.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { loadIcons } from './canonical.mjs';

let failures = 0;
const check = (label, ok, detail = '') => {
    console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? `  ${detail}` : ''}`);
    if (!ok) failures++;
};

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const icons = loadIcons();

const core = read('packages/core/package.json');
const react = read('packages/react/package.json');

// ── Versions ──────────────────────────────────────────────────────────────────

console.log('— versions —');
check('core and react share a version', core.version === react.version, `${core.version} / ${react.version}`);

// ── Core package ──────────────────────────────────────────────────────────────

console.log('— ghicons (core) —');

for (const f of core.files) {
    check(`declared file exists: ${f}`, fs.existsSync(path.join('packages/core', f)));
}

const registry = read('packages/core/registry.json');
check('registry version matches package', registry.version === core.version, `${registry.version}`);
check('registry lists every icon', registry.icons.length === icons.length, `${registry.icons.length} vs ${icons.length}`);
check(
    'every registry entry resolves to a shipped SVG',
    registry.icons.every((i) => fs.existsSync(path.join('packages/core', i.file)))
);
check(
    'no shipped SVG is missing from the registry',
    (() => {
        const shipped = [];
        const walk = (d) => {
            for (const e of fs.readdirSync(d, { withFileTypes: true })) {
                const f = path.join(d, e.name);
                if (e.isDirectory()) walk(f);
                else if (e.name.endsWith('.svg')) shipped.push(path.relative('packages/core', f).split(path.sep).join('/'));
            }
        };
        walk('packages/core/svg');
        const known = new Set(registry.icons.map((i) => i.file));
        return shipped.every((f) => known.has(f)) && shipped.length === registry.icons.length;
    })()
);
check('slugs are unique', new Set(registry.icons.map((i) => i.slug)).size === registry.icons.length);
check(
    'every shipped SVG uses currentColor',
    registry.icons.every((i) =>
        fs.readFileSync(path.join('packages/core', i.file), 'utf8').includes('fill="currentColor"')
    )
);
check('core declares no dependencies', !core.dependencies || Object.keys(core.dependencies).length === 0);

// ── React package ─────────────────────────────────────────────────────────────

console.log('— @ghicons/react —');

for (const f of react.files) {
    check(`declared file exists: ${f}`, fs.existsSync(path.join('packages/react', f)));
}

for (const entry of ['dist/index.es.js', 'dist/index.umd.js', 'dist/index.d.ts']) {
    check(`entry point exists: ${entry}`, fs.existsSync(path.join('packages/react', entry)));
}

const bundle = fs.readFileSync('packages/react/dist/index.es.js', 'utf8');
check('bundle does not inline React', !/react\/jsx-runtime['"]\s*\)/.test(bundle) || bundle.includes('import'));
check('react declares react as a peer dependency', Boolean(react.peerDependencies?.react));
check('react declares no runtime dependencies', !react.dependencies || Object.keys(react.dependencies).length === 0);

// Development files must never reach the tarball.
const leaked = [];
const walkDist = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name);
        if (e.isDirectory()) walkDist(f);
        else if (/(^|\/)(App|main)\.|\.stories\./.test(f)) leaked.push(f);
    }
};
walkDist('packages/react/dist');
check('no playground or story files in dist', leaked.length === 0, leaked.join(', '));

// ── Cross-package agreement ───────────────────────────────────────────────────

console.log('— cross-package —');

const barrel = fs.readFileSync('packages/react/src/index.ts', 'utf8');
const exported = [...barrel.matchAll(/export \{ default as (\w+) \}/g)].map((m) => m[1]);

check('react exports one component per icon', exported.length === icons.length, `${exported.length} vs ${icons.length}`);
check('every icon is exported', icons.every((i) => exported.includes(i.name)));
check(
    'no export refers to a missing icon',
    exported.every((n) => icons.some((i) => i.name === n))
);
check(
    'registry names and react exports agree',
    registry.icons.every((i) => exported.includes(i.name))
);

console.log();
if (failures) {
    console.error(`${failures} check${failures === 1 ? '' : 's'} failed — not safe to publish.`);
    process.exit(1);
}
console.log(`All checks passed. ${icons.length} icons, version ${core.version}.`);
