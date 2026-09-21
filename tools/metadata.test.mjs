/**
 * The authored-metadata contract.
 *
 * These rules decide what reaches the published registry, and a registry entry
 * is the one thing a consumer cannot correct for itself — so the checks are
 * worth pinning down rather than trusting to a careful reviewer.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AUTHORED_FIELDS, checkMetadata, iconFor, loadMetadata, sidecarFor } from './metadata.mjs';
import { loadIcons } from './canonical.mjs';

const errors = (data, icon) => checkMetadata(data, icon).filter((p) => p.level === 'error').map((p) => p.message);
const warnings = (data, icon) => checkMetadata(data, icon).filter((p) => p.level === 'warn').map((p) => p.message);

const SOURCED = {
    meaning: 'Except God',
    references: ['Willis, W. Bruce. The Adinkra Dictionary (1998)'],
};

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<path d="M4 4h16v16H4z" fill="currentColor"/></svg>\n';

describe('checkMetadata', () => {
    it('accepts a fully authored sidecar', () => {
        expect(checkMetadata({
            meaning: 'Except God',
            note: 'The most widely reproduced of the Adinkra symbols.',
            keywords: ['god', 'supremacy', 'faith'],
            aliases: ['Gye Nyame'],
            references: ['Willis, W. Bruce. The Adinkra Dictionary (1998)'],
        }, { name: 'GyeNyame' })).toEqual([]);
    });

    it('rejects a meaning with no source', () => {
        expect(errors({ meaning: 'Except God' })).toEqual([
            expect.stringContaining('must say where it came from'),
        ]);
    });

    it('rejects a note with no source', () => {
        expect(errors({ note: 'Regional variations exist.' })).toHaveLength(1);
    });

    it('allows keywords and aliases without references', () => {
        // Neither makes a claim about what a symbol means, so neither needs one.
        expect(errors({ keywords: ['god'], aliases: ['Gye Nyame'] })).toEqual([]);
    });

    it('warns when Wikipedia is the only source', () => {
        expect(warnings({ ...SOURCED, references: ['https://en.wikipedia.org/wiki/Gye_Nyame'] }))
            .toEqual([expect.stringContaining('primary or institutional source')]);
    });

    it('accepts Wikipedia alongside a stronger source without warning', () => {
        expect(warnings({
            ...SOURCED,
            references: [...SOURCED.references, 'https://en.wikipedia.org/wiki/Gye_Nyame'],
        })).toEqual([]);
    });

    it('rejects a derived field, however well meant', () => {
        expect(errors({ ...SOURCED, slug: 'gye-nyame' })).toEqual([
            expect.stringContaining('derived from the collection'),
        ]);
    });

    it('rejects an unknown field rather than ignoring it', () => {
        // A silently dropped `meanings` is research that looks committed and is
        // nowhere in the registry.
        const messages = errors({ ...SOURCED, meanings: 'Except God' });
        expect(messages).toEqual([expect.stringContaining('unknown field `meanings`')]);
        expect(messages[0]).toContain(AUTHORED_FIELDS.join(', '));
    });

    it('requires keywords to be lowercase search terms', () => {
        expect(errors({ keywords: ['God'] })).toEqual([expect.stringContaining('must be lowercase')]);
        expect(errors({ keywords: ['fear of god?'] })).toHaveLength(1);
    });

    it('rejects repeated entries in a list', () => {
        expect(errors({ keywords: ['god', 'god'] })).toEqual([expect.stringContaining('repeats')]);
        // Case-insensitively, since the registry is what search reads.
        expect(errors({ aliases: ['Gye Nyame', 'gye nyame'] })).toEqual([expect.stringContaining('repeats')]);
    });

    it('rejects an empty list rather than treating it as absent', () => {
        expect(errors({ keywords: [] })).toEqual([expect.stringContaining('omit it instead')]);
    });

    it("rejects an alias that is the icon's own name", () => {
        expect(errors({ aliases: ['GyeNyame'] }, { name: 'GyeNyame' })).toEqual([
            expect.stringContaining("icon's own name"),
        ]);
    });

    it('keeps a meaning to a single line', () => {
        expect(errors({ ...SOURCED, meaning: 'Except God\nand nobody else' })).toEqual([
            expect.stringContaining('single line'),
        ]);
    });

    it('rejects an empty sidecar', () => {
        expect(errors({})).toEqual([expect.stringContaining('delete it')]);
    });

    it('rejects a sidecar that is not an object', () => {
        expect(errors(['Except God'])).toEqual([expect.stringContaining('JSON object')]);
    });
});

describe('file layout', () => {
    it('mirrors an icon path under metadata/', () => {
        expect(sidecarFor('svg/adinkra/GyeNyame.svg')).toBe(path.join('metadata', 'adinkra', 'GyeNyame.json'));
    });

    it('maps back to the icon it documents', () => {
        // What the validator reports an orphaned metadata file against.
        expect(iconFor('metadata/general/GhanaCedi.json')).toBe(path.join('svg', 'general', 'GhanaCedi.svg'));
    });
});

describe('the pipeline', () => {
    let root;
    let svgDir;
    let metaDir;
    let icon;

    beforeEach(() => {
        root = fs.mkdtempSync(path.join(os.tmpdir(), 'ghicons-meta-'));
        svgDir = path.join(root, 'svg');
        metaDir = path.join(root, 'metadata');
        icon = path.join(svgDir, 'adinkra', 'GyeNyame.svg');
        fs.mkdirSync(path.dirname(icon), { recursive: true });
        fs.mkdirSync(path.join(metaDir, 'adinkra'), { recursive: true });
        fs.writeFileSync(icon, SVG);
    });

    afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

    const write = (contents) =>
        fs.writeFileSync(
            sidecarFor(icon, { svgDir, metaDir }),
            typeof contents === 'string' ? contents : JSON.stringify(contents),
        );

    it('attaches authored metadata to the canonical icon', () => {
        write({ ...SOURCED, keywords: ['god'] });
        const [loaded] = loadIcons(svgDir, metaDir);
        expect(loaded.metadata).toEqual({ ...SOURCED, keywords: ['god'] });
    });

    it('leaves metadata empty when an icon has none', () => {
        expect(loadIcons(svgDir, metaDir)[0].metadata).toEqual({});
    });

    it('fails the build on invalid metadata rather than dropping the fields', () => {
        write({ meaning: 'Except God' });
        expect(() => loadIcons(svgDir, metaDir)).toThrow(/must say where it came from/);
    });

    it('fails the build on malformed JSON', () => {
        write('{ "meaning": ');
        expect(() => loadIcons(svgDir, metaDir)).toThrow(/invalid JSON/);
    });

    it('reads only the authored fields, never anything else in the file', () => {
        // Belt and braces: validation rejects unknown keys, and the loader would
        // still not carry one into the registry.
        write({ ...SOURCED, internalNote: 'do not ship' });
        const { data, problems } = loadMetadata(icon, { svgDir, metaDir });
        expect(problems.some((p) => p.level === 'error')).toBe(true);
        expect(data).toEqual({});
    });
});
