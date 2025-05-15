const fs = require('fs');
const path = require('path');
// const process = require('process');
const pc = require('picocolors');

const storiesDir = path.resolve('src/stories');

// Template for generating a story
const generateStoryTemplate = (componentName) => `
import type {Meta, StoryObj} from '@storybook/react';
import {${componentName}} from "../index";

const meta: Meta<typeof ${componentName}> = {
    title: 'Icons/${componentName}',
    component: ${componentName},
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: {type: 'text'},
            description: 'The size of the icon in pixels',
        },
        color: {
            control: {type: 'color'},
            description: 'The color of the icon',
        },
        className: {
            control: {type: 'text'},
            description: 'Additional CSS classes to apply to the icon',
        },
        style: {
            control: {type: 'object'},
            description: 'Inline styles to apply to the icon',
        },
        viewBox: {
            control: {type: 'text'},
            description: 'The viewBox attribute for the SVG element',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

// Default story with default props
export const Default: Story = {
    args: {
        size: 24,
        color: 'currentColor',
    },
};

// Large icon story
export const Large: Story = {
    args: {
        size: "48px",
        color: 'currentColor',
    },
};

// Colored icon story
export const Colored: Story = {
    args: {
        size: 24,
        color: '#ff5722',
    },
};

// Small colored icon story
export const SmallColored: Story = {
    args: {
        size: 16,
        color: '#2196f3',
    },
};
`;

const generateStories = (componentsDir) => {
    if (!fs.existsSync(componentsDir)) {
        console.error(pc.red(`Directory "${componentsDir}" does not exist.`));
        process.exit(1);
    }

    if (!fs.existsSync(storiesDir)) {
        fs.mkdirSync(storiesDir, { recursive: true });
    }

    const files = fs.readdirSync(componentsDir);

    files.forEach((file) => {
        const filePath = path.join(componentsDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile() && file.endsWith('.tsx')) {
            const componentName = path.basename(file, '.tsx');
            const storyFilePath = path.join(storiesDir, `${componentName}.stories.tsx`);

            if (fs.existsSync(storyFilePath)) {
                console.log(pc.yellow(`Story for "${componentName}" already exists. Skipping...`));
                return;
            }

            const storyContent = generateStoryTemplate(componentName);
            fs.writeFileSync(storyFilePath, storyContent);
            console.log(pc.green(`Generated story for "${componentName}" at "${storyFilePath}".`));
        }
    });
};

// CLI input handling
const componentsDir = process.argv[2];
if (!componentsDir) {
    console.error(pc.red('Please provide the path to the components directory as an argument.'));
    process.exit(1);
}

generateStories(path.resolve(componentsDir));