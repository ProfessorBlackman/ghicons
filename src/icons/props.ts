import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    // onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
    // onMouseEnter?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
    // onMouseLeave?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

export interface IconComponent extends React.FC<IconProps> {
    displayName: string;
}

export interface IconMap {
    [key: string]: IconComponent;
}

export const trueSize = (size: string|number) => {
    if (typeof size === 'string') {
        // Allow zero without units
        if (size === '0') return size;

        // Regular expression for valid CSS units
        const validUnits = /^-?\d*\.?\d+(px|em|rem|%|vh|vw|vmin|vmax|cm|mm|in|pt|pc)$/;

        if (!validUnits.test(size)) {
            return `${size}px`;
        }
        return size;
    }
    return `${size}px`;
};