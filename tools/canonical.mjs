/**
 * The canonical icon representation.
 *
 * Reads svg/ and produces one framework-neutral object per icon. Every
 * generator — the core package, the React adapter, anything added later —
 * consumes this and nothing else, so no generator needs to know how an SVG is
 * parsed or optimised.
 *
 * See docs/ARCHITECTURE.md ("The Pipeline").
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';
import { loadMetadata, sidecarFor } from './metadata.mjs';

/** Repo root, so every tool works regardless of the directory it runs from. */
export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const fromRoot = (...p) => path.join(ROOT, ...p);

export const SVG_DIR = fromRoot('svg');
/** Authored research, one file per icon, mirroring svg/. See tools/metadata.mjs. */
export const META_DIR = fromRoot('metadata');
export const CANVAS = '0 0 24 24';

/**
 * Shared optimisation settings. Every output passes through these, so the raw
 * SVG in the core package and the inlined paths in a framework component are
 * always the same geometry.
 *
 * Note on precision: SVGO's coordinate rounding shifts outlines by a fraction
 * of a pixel. That is expected and applies to any icon pipeline; what must not
 * change is the icon's geometry or meaning. Raising the precision inflates
 * every bundle for a difference no one can see at icon sizes.
 */
const SVGO_CONFIG = {
    multipass: true,
    // preset-default in SVGO 4 preserves viewBox, which the icon contract
    // requires. Each target rewrites the root tag anyway, from the viewBox
    // read back out of the optimised output.
    plugins: ['preset-default'],
};

/** `GyeNyame` → `gye-nyame`, `UACNkanea` → `uac-nkanea`. */
export function toSlug(name) {
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else if (entry.name.endsWith('.svg')) out.push(full);
    }
    return out;
}

/**
 * Build the canonical representation of every icon in the collection.
 *
 * Authored metadata — meaning, note, keywords, aliases, references — is read
 * from each icon's JSON sidecar and attached as `metadata`, so every generator
 * gets the research along with the artwork rather than reaching for it
 * separately.
 *
 * @returns {Array<{
 *   name: string, slug: string, category: string, viewBox: string,
 *   body: string, svg: string, sourcePath: string, file: string,
 *   metadata: Record<string, unknown>
 * }>} sorted by name
 */
export function loadIcons(svgDir = SVG_DIR, metaDir = META_DIR) {
    const icons = walk(svgDir).map((sourcePath) => {
        const name = path.basename(sourcePath, '.svg');
        const category = path
            .relative(svgDir, path.dirname(sourcePath))
            .split(path.sep)
            .join('/');

        const raw = fs.readFileSync(sourcePath, 'utf8');
        const optimised = optimize(raw, structuredClone(SVGO_CONFIG)).data;

        const viewBox = optimised.match(/viewBox\s*=\s*["']([^"']+)["']/)?.[1]?.trim() ?? CANVAS;

        // Everything between the root tags: the artwork, without the root
        // attributes each target rewrites for itself.
        const body = optimised
            .replace(/^[\s\S]*?<svg\b[^>]*>/, '')
            .replace(/<\/svg>\s*$/, '')
            .trim();

        if (!body) throw new Error(`${sourcePath}: no drawable content after optimisation`);

        // The build refuses a malformed sidecar rather than dropping the fields
        // silently and shipping an icon whose research looks unwritten.
        const { data: metadata, problems } = loadMetadata(sourcePath, { name, svgDir, metaDir });
        const errors = problems.filter((p) => p.level === 'error');
        if (errors.length) {
            throw new Error(
                `${sidecarFor(sourcePath, { svgDir, metaDir })}: ${errors.map((e) => e.message).join('; ')}\n` +
                `Run \`pnpm run validate\` for the full report.`
            );
        }

        return {
            name,
            slug: toSlug(name),
            category,
            viewBox,
            body,
            svg: renderSvg({ viewBox, body }),
            sourcePath: sourcePath.split(path.sep).join('/'),
            file: `svg/${category}/${name}.svg`,
            metadata,
        };
    });

    icons.sort((a, b) => a.name.localeCompare(b.name));

    // A duplicate slug would make two icons indistinguishable in the registry,
    // in a CDN path and in every URL built from one.
    const seen = new Map();
    for (const icon of icons) {
        if (seen.has(icon.slug)) {
            throw new Error(
                `Duplicate slug "${icon.slug}": ${seen.get(icon.slug)} and ${icon.name}`
            );
        }
        seen.set(icon.slug, icon.name);
    }

    return icons;
}

/** The canonical standalone SVG for an icon, with a normalised root element. */
export function renderSvg({ viewBox, body }) {
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ` +
        `width="24" height="24" fill="currentColor">${body}</svg>\n`
    );
}
