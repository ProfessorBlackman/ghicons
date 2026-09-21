#!/usr/bin/env node
/**
 * GHIcons icon validator.
 *
 * Enforces docs/ICON-SPEC.md against the canonical SVG collection.
 *
 *   node tools/validate.mjs                      validate every icon
 *   node tools/validate.mjs svg/adinkra/New.svg  validate specific files
 *   node tools/validate.mjs --json               machine-readable output
 *
 * Exits non-zero if any icon fails. When GITHUB_STEP_SUMMARY is set, also
 * writes a results table to the workflow summary.
 *
 * This validates the WHOLE collection by default, not just changed files.
 * Checking only changed files is how 103 of 106 icons drifted to a hardcoded
 * fill='#fff' without a single failing build.
 */

import fs from 'node:fs';
import path from 'node:path';
import { optimize } from 'svgo';

const SVG_DIR = 'svg';
const SPEC = 'docs/ICON-SPEC.md';

/**
 * Icons that predate a rule and are tracked for resolution in the "Known
 * Exceptions" table of the icon specification. These report as warnings so the
 * debt stays visible, while any NEW violation of the same rule still fails.
 *
 * Removing an entry here is the last step of actually fixing the icon.
 */
const KNOWN_EXCEPTIONS = {
    // Currently empty — the whole collection conforms. Add an entry only for an
    // icon that predates a rule and is recorded in the specification's
    // "Known Exceptions" table, never to silence a new violation.
};

const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const targets = args.filter((a) => !a.startsWith('-'));

// ─── Rules ────────────────────────────────────────────────────────────────────

/** Every rule: id, human description, and a check returning an error or null. */
const RULES = [
    {
        id: 'svg/parseable',
        check: (src) => {
            try {
                const r = optimize(src, { plugins: [] });
                if (r.error) return `invalid SVG: ${r.error}`;
            } catch (e) {
                return `invalid SVG: ${e.message.split('\n')[0]}`;
            }
            const roots = src.match(/<svg[\s>]/g) ?? [];
            if (roots.length === 0) return 'no <svg> element found';
            if (roots.length > 1) return `${roots.length} <svg> elements — an icon must have a single root`;
            return null;
        },
    },
    {
        id: 'canvas/viewbox',
        check: (src) => {
            const m = src.match(/viewBox\s*=\s*["']([^"']*)["']/);
            if (!m) return '`viewBox` is missing — expected `0 0 24 24`';
            const vb = m[1].trim().replace(/[\s,]+/g, ' ');
            if (vb !== '0 0 24 24') return `\`viewBox\` is \`${vb}\` — expected \`0 0 24 24\``;
            return null;
        },
    },
    {
        id: 'colour/currentcolor',
        check: (src) => {
            const bad = [];
            const attr = /\b(fill|stroke)\s*=\s*["']([^"']*)["']/g;
            for (const m of src.matchAll(attr)) {
                const v = m[2].trim();
                if (v && v !== 'currentColor' && v !== 'none' && !v.startsWith('url(#')) {
                    bad.push(`${m[1]}="${v}"`);
                }
            }
            const style = /\b(fill|stroke)\s*:\s*([^;}"']+)/g;
            for (const m of src.matchAll(style)) {
                const v = m[2].trim();
                if (v && v !== 'currentColor' && v !== 'none' && !v.startsWith('url(#')) {
                    bad.push(`${m[1]}: ${v}`);
                }
            }
            if (!bad.length) return null;
            const uniq = [...new Set(bad)];
            return `hardcoded colour ${uniq.slice(0, 3).map((s) => `\`${s}\``).join(', ')}` +
                `${uniq.length > 3 ? ` and ${uniq.length - 3} more` : ''} — use \`currentColor\` or \`none\``;
        },
    },
    {
        id: 'colour/no-gradients',
        check: (src) => {
            // A gradient carries its colour in <stop> elements, so it slips past the
            // fill/stroke check above while still making the icon multicolour.
            if (/<(linear|radial)Gradient[\s>]/i.test(src)) return 'gradient element — GHIcons are monochrome';
            if (/stop-color/i.test(src)) return '`stop-color` — GHIcons are monochrome';
            return null;
        },
    },
    {
        id: 'safety/no-raster',
        check: (src) =>
            /<image[\s>]/i.test(src) ? 'embedded `<image>` element — icons must be pure vector'
                : /base64\s*,/i.test(src) ? 'base64-encoded payload — icons must be pure vector'
                    : null,
    },
    {
        id: 'safety/no-scripts',
        check: (src) =>
            /<script[\s>/]/i.test(src) ? '`<script>` element'
                : /\bon[a-z]+\s*=\s*["']/i.test(src) ? 'inline event handler attribute'
                    : null,
    },
    {
        id: 'safety/no-remote',
        check: (src) =>
            /@import/i.test(src) ? '`@import` in a style block'
                : /url\(\s*["']?(https?:)?\/\//i.test(src) ? 'remote `url()` reference'
                    : /\b(href|xlink:href)\s*=\s*["'](https?:)?\/\//i.test(src) ? 'remote `href` reference'
                        : null,
    },
    {
        id: 'naming/pascalcase',
        check: (_src, file) => {
            const name = path.basename(file, '.svg');
            return /^[A-Z][A-Za-z0-9]*$/.test(name)
                ? null
                : `filename \`${name}.svg\` is not PascalCase (e.g. \`GyeNyame.svg\`)`;
        },
    },
    {
        id: 'naming/numeric-suffix',
        check: (_src, file) => {
            const name = path.basename(file, '.svg');
            return /\d$/.test(name)
                ? `filename \`${name}.svg\` ends in a digit — name the symbol, do not number it`
                : null;
        },
    },
    {
        id: 'naming/icon-suffix',
        check: (_src, file) => {
            const name = path.basename(file, '.svg');
            return /Icon$/.test(name)
                ? `filename \`${name}.svg\` has a redundant \`Icon\` suffix — every entry is an icon`
                : null;
        },
    },
];

// ─── Collection ───────────────────────────────────────────────────────────────

function collect(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) collect(full, out);
        else if (entry.name.endsWith('.svg')) out.push(full);
    }
    return out;
}

const files = (targets.length ? targets : collect(SVG_DIR)).map((f) => f.split(path.sep).join('/')).sort();

if (!files.length) {
    console.error(`No SVG files found in ${SVG_DIR}/`);
    process.exit(1);
}

// ─── Run ──────────────────────────────────────────────────────────────────────

const results = [];

for (const file of files) {
    const errors = [];
    const warnings = [];
    let src;

    try {
        src = fs.readFileSync(file, 'utf8');
    } catch (e) {
        results.push({ file, errors: [{ rule: 'io', message: `could not read: ${e.message}` }], warnings: [] });
        continue;
    }

    for (const rule of RULES) {
        const message = rule.check(src, file);
        if (!message) continue;
        const excused = KNOWN_EXCEPTIONS[file]?.includes(rule.id);
        (excused ? warnings : errors).push({ rule: rule.id, message });
    }

    results.push({ file, errors, warnings });
}

const failed = results.filter((r) => r.errors.length);
const warned = results.filter((r) => !r.errors.length && r.warnings.length);
const passed = results.length - failed.length;

// ─── Report ───────────────────────────────────────────────────────────────────

if (jsonOutput) {
    console.log(JSON.stringify({ total: results.length, passed, failed: failed.length, results }, null, 2));
} else {
    const g = (s) => `\x1b[32m${s}\x1b[0m`;
    const r = (s) => `\x1b[31m${s}\x1b[0m`;
    const y = (s) => `\x1b[33m${s}\x1b[0m`;
    const dim = (s) => `\x1b[2m${s}\x1b[0m`;

    for (const res of failed) {
        console.log(r(`✗ ${res.file}`));
        for (const e of res.errors) console.log(`    ${e.message} ${dim(`[${e.rule}]`)}`);
    }
    for (const res of warned) {
        console.log(y(`! ${res.file}`));
        for (const w of res.warnings) {
            console.log(`    ${dim('known exception:')} ${w.message} ${dim(`[${w.rule}]`)}`);
        }
    }

    console.log();
    console.log(
        `${results.length} icon${results.length === 1 ? '' : 's'} checked — ` +
        `${g(`${passed} passed`)}` +
        `${failed.length ? `, ${r(`${failed.length} failed`)}` : ''}` +
        `${warned.length ? `, ${y(`${warned.length} known exception${warned.length === 1 ? '' : 's'}`)}` : ''}`
    );
    if (failed.length) console.log(dim(`\nThe rules are defined in ${SPEC}`));
}

// ─── GitHub Actions job summary ───────────────────────────────────────────────

if (process.env.GITHUB_STEP_SUMMARY) {
    const columns = [
        ['viewBox', 'canvas/viewbox'],
        ['currentColor', 'colour/currentcolor'],
        ['Vector only', 'safety/no-raster'],
        ['No scripts', 'safety/no-scripts'],
        ['No remote refs', 'safety/no-remote'],
        ['Naming', 'naming/'],
    ];
    const mark = (res, prefix) => {
        if (res.errors.some((e) => e.rule.startsWith(prefix))) return '❌';
        if (res.warnings.some((w) => w.rule.startsWith(prefix))) return '⚠️';
        return '✅';
    };

    let md = '## Icon Validation\n\n';
    md += `**${passed} passed** &nbsp;|&nbsp; **${failed.length} failed** &nbsp;|&nbsp; `;
    md += `**${warned.length} known exception${warned.length === 1 ? '' : 's'}** &nbsp;|&nbsp; **${results.length} total**\n\n`;
    md += `_Validated against [\`${SPEC}\`](../blob/HEAD/${SPEC}) — the whole collection, not only changed files._\n\n`;

    const shown = [...failed, ...warned];
    if (shown.length) {
        md += `| File | ${columns.map(([label]) => label).join(' | ')} |\n`;
        md += `|---|${columns.map(() => ':---:').join('|')}|\n`;
        for (const res of shown) {
            md += `| \`${res.file}\` | ${columns.map(([, p]) => mark(res, p)).join(' | ')} |\n`;
        }
        md += '\n### Details\n\n';
        for (const res of shown) {
            md += `**\`${res.file}\`**\n`;
            for (const e of res.errors) md += `- ❌ ${e.message}\n`;
            for (const w of res.warnings) md += `- ⚠️ known exception: ${w.message}\n`;
            md += '\n';
        }
    } else {
        md += 'Every icon in the collection conforms to the specification. ✅\n';
    }

    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
}

if (failed.length) {
    if (process.env.GITHUB_ACTIONS) {
        for (const res of failed) {
            for (const e of res.errors) {
                console.log(`::error file=${res.file}::${e.message.replace(/`/g, '')}`);
            }
        }
    }
    process.exit(1);
}
