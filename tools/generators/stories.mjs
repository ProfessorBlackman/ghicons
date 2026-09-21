#!/usr/bin/env node
/**
 * Generates a Storybook story per React component.
 *
 *   packages/react/stories/<Name>.stories.tsx
 *
 * Rebuilt from scratch every run, so a renamed or deleted icon cannot leave a
 * story behind importing an export that no longer exists.
 *
 * Run from the repository root.
 */

import fs from 'node:fs';
import { loadIcons, fromRoot } from '../canonical.mjs';

const OUT = fromRoot('packages/react/stories');

const story = (icon) => `import type { Meta, StoryObj } from '@storybook/react';
import { ${icon.name} } from '../src';

const meta: Meta<typeof ${icon.name}> = {
    title: 'Icons/${icon.category}/${icon.name}',
    component: ${icon.name},
    tags: ['autodocs'],
    argTypes: {
        size: { control: { type: 'text' }, description: 'Size in pixels, or any CSS unit' },
        color: { control: { type: 'color' }, description: 'Icon colour' },
        className: { control: { type: 'text' }, description: 'Additional CSS classes' },
        style: { control: { type: 'object' }, description: 'Inline styles' },
        viewBox: { control: { type: 'text' }, description: 'SVG viewBox' },
    },
};

export default meta;
type Story = StoryObj<typeof ${icon.name}>;

export const Default: Story = { args: { size: 24, color: 'currentColor' } };
export const Large: Story = { args: { size: '48px', color: 'currentColor' } };
export const Colored: Story = { args: { size: 24, color: '#ff5722' } };
export const SmallColored: Story = { args: { size: 16, color: '#2196f3' } };
`;

const icons = loadIcons();

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const icon of icons) {
    fs.writeFileSync(`${OUT}/${icon.name}.stories.tsx`, story(icon));
}

console.log(`@ghicons/react: ${icons.length} stories written to ${OUT}/`);
