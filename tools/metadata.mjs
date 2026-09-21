/**
 * Authored icon metadata: the contract for what a human may record about an
 * icon, and the checks that keep it honest.
 *
 * Everything the pipeline can work out for itself — name, slug, category,
 * viewBox, file — is derived from the collection and never written by hand.
 * What is left is research: what a symbol means, what it is also called, what
 * someone would search for, and where that came from. That lives in a JSON
 * file mirroring the icon's path under metadata/:
 *
 *   svg/adinkra/GyeNyame.svg        the artwork
 *   metadata/adinkra/GyeNyame.json  what is known about it
 *
 * One file per icon rather than one index for the collection, because a
 * symbol's research is reviewed as a unit and two people documenting two icons
 * never touch the same lines. Kept out of svg/ so that tree stays purely
 * canonical artwork.
 *
 * See docs/ICON-SPEC.md and docs/wiki/Cultural-Guidelines.md.
 */

import fs from 'node:fs';
import path from 'node:path';

/** Fields a contributor may author. Anything else in a sidecar is a mistake. */
export const AUTHORED_FIELDS = ['meaning', 'note', 'keywords', 'aliases', 'references'];

/** Fields the pipeline derives. A sidecar that restates one is rejected. */
export const DERIVED_FIELDS = ['name', 'slug', 'category', 'viewBox', 'file'];

/** One concise sentence. Longer context belongs in `note`. */
const MEANING_MAX = 240;
const NOTE_MAX = 1200;
const KEYWORD_MAX = 32;
const KEYWORDS_MAX = 24;
/** Author, title, edition and a URL in one line adds up. */
const REFERENCE_MAX = 300;

/** Lowercase words, digits, spaces and hyphens: search terms, not prose. */
const KEYWORD_PATTERN = /^[a-z0-9][a-z0-9 -]*$/;

/** Repo-relative defaults, for tools that run from the repository root. */
export const SVG_DIR = 'svg';
export const META_DIR = 'metadata';

/** `svg/adinkra/GyeNyame.svg` → `metadata/adinkra/GyeNyame.json`. */
export function sidecarFor(svgPath, { svgDir = SVG_DIR, metaDir = META_DIR } = {}) {
    const relative = path.relative(svgDir, svgPath).replace(/\.svg$/, '.json');
    return path.join(metaDir, relative);
}

/** The reverse, for reporting on a metadata file the pipeline cannot place. */
export function iconFor(metadataPath, { svgDir = SVG_DIR, metaDir = META_DIR } = {}) {
    const relative = path.relative(metaDir, metadataPath).replace(/\.json$/, '.svg');
    return path.join(svgDir, relative);
}

const isPlainObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

function checkStringArray(value, field, problems, { max = Infinity, maxLength = 200 } = {}) {
    if (!Array.isArray(value)) {
        problems.push({ level: 'error', message: `\`${field}\` must be an array of strings` });
        return [];
    }
    if (value.length === 0) {
        problems.push({ level: 'error', message: `\`${field}\` is empty — omit it instead` });
        return [];
    }
    if (value.length > max) {
        problems.push({ level: 'error', message: `\`${field}\` has ${value.length} entries — at most ${max}` });
    }

    const seen = new Set();
    for (const entry of value) {
        if (typeof entry !== 'string' || !entry.trim()) {
            problems.push({ level: 'error', message: `\`${field}\` contains an empty or non-string entry` });
            continue;
        }
        if (entry !== entry.trim()) {
            problems.push({ level: 'error', message: `\`${field}\` entry \`${entry}\` has leading or trailing whitespace` });
        }
        if (entry.length > maxLength) {
            problems.push({ level: 'error', message: `\`${field}\` entry is ${entry.length} characters — at most ${maxLength}` });
        }
        const key = entry.trim().toLowerCase();
        if (seen.has(key)) {
            problems.push({ level: 'error', message: `\`${field}\` repeats \`${entry}\`` });
        }
        seen.add(key);
    }
    return value.filter((e) => typeof e === 'string' && e.trim());
}

/**
 * Check one sidecar's contents.
 *
 * @param {unknown} data parsed sidecar
 * @param {{ name?: string }} icon the icon it belongs to
 * @returns {Array<{ level: 'error' | 'warn', message: string }>}
 */
export function checkMetadata(data, { name } = {}) {
    const problems = [];

    if (!isPlainObject(data)) {
        return [{ level: 'error', message: 'sidecar must contain a JSON object' }];
    }

    const keys = Object.keys(data);
    if (keys.length === 0) {
        return [{ level: 'error', message: 'sidecar is empty — delete it rather than committing a placeholder' }];
    }

    for (const key of keys) {
        if (DERIVED_FIELDS.includes(key)) {
            problems.push({
                level: 'error',
                message: `\`${key}\` is derived from the collection — remove it, the pipeline sets it`,
            });
        } else if (!AUTHORED_FIELDS.includes(key)) {
            problems.push({
                level: 'error',
                message: `unknown field \`${key}\` — allowed: ${AUTHORED_FIELDS.join(', ')}`,
            });
        }
    }

    for (const [field, max] of [['meaning', MEANING_MAX], ['note', NOTE_MAX]]) {
        if (!(field in data)) continue;
        const value = data[field];
        if (typeof value !== 'string' || !value.trim()) {
            problems.push({ level: 'error', message: `\`${field}\` must be a non-empty string` });
            continue;
        }
        if (value !== value.trim()) {
            problems.push({ level: 'error', message: `\`${field}\` has leading or trailing whitespace` });
        }
        if (value.length > max) {
            problems.push({ level: 'error', message: `\`${field}\` is ${value.length} characters — at most ${max}` });
        }
        if (field === 'meaning' && /\n/.test(value)) {
            problems.push({ level: 'error', message: '`meaning` must be a single line — put the longer account in `note`' });
        }
    }

    if ('keywords' in data) {
        const keywords = checkStringArray(data.keywords, 'keywords', problems, {
            max: KEYWORDS_MAX,
            maxLength: KEYWORD_MAX,
        });
        for (const keyword of keywords) {
            if (!KEYWORD_PATTERN.test(keyword)) {
                problems.push({
                    level: 'error',
                    message: `keyword \`${keyword}\` must be lowercase words, digits, spaces or hyphens — it is a search term, not prose`,
                });
            }
        }
    }

    if ('aliases' in data) {
        const aliases = checkStringArray(data.aliases, 'aliases', problems);
        if (name) {
            for (const alias of aliases) {
                if (alias === name) {
                    problems.push({
                        level: 'error',
                        message: `alias \`${alias}\` is the icon's own name — aliases are the *other* things it is called`,
                    });
                }
            }
        }
    }

    const documented = typeof data.meaning === 'string' || typeof data.note === 'string';

    if ('references' in data) {
        const references = checkStringArray(data.references, 'references', problems, {
            maxLength: REFERENCE_MAX,
        });
        // Cultural-Guidelines.md: "A Wikipedia link alone is not sufficient."
        // A warning, not an error: it should be visible without blocking someone
        // part-way through their research.
        if (references.length && references.every((r) => /wikipedia\.org|^wikipedia\b/i.test(r))) {
            problems.push({
                level: 'warn',
                message: 'every reference is Wikipedia — verify against a primary or institutional source (see Cultural-Guidelines.md)',
            });
        }
    } else if (documented) {
        problems.push({
            level: 'error',
            message: '`meaning` or `note` without `references` — a documented meaning must say where it came from',
        });
    }

    return problems;
}

/**
 * Read and check the sidecar for an icon, if it has one.
 *
 * @param {string} svgPath path to the icon's SVG
 * @param {{ name?: string, svgDir?: string, metaDir?: string }} options
 * @returns {{
 *   path: string | null,
 *   data: Record<string, unknown>,
 *   problems: Array<{ level: 'error' | 'warn', message: string }>
 * }}
 */
export function loadMetadata(svgPath, { name, svgDir, metaDir } = {}) {
    const file = sidecarFor(svgPath, { svgDir, metaDir });
    if (!fs.existsSync(file)) return { path: null, data: {}, problems: [] };

    let parsed;
    try {
        parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return {
            path: file,
            data: {},
            problems: [{ level: 'error', message: `invalid JSON: ${e.message}` }],
        };
    }

    const problems = checkMetadata(parsed, { name });
    if (problems.some((p) => p.level === 'error')) return { path: file, data: {}, problems };

    // Only the authored fields, so a field added to the sidecar format cannot
    // reach the registry before the pipeline knows about it.
    const data = {};
    for (const field of AUTHORED_FIELDS) {
        if (field in parsed) data[field] = parsed[field];
    }
    return { path: file, data, problems };
}
