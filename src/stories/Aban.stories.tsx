import type {Meta, StoryObj} from '@storybook/react';
import {Aban} from "../index";

const meta: Meta<typeof Aban> = {
    title: 'Icons/Aban',
    component: Aban,
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
    },
};

export default meta;
type Story = StoryObj<typeof Aban>;

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