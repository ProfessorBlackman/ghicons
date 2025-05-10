import * as React from "react";
import {type IconProps, trueSize} from "../props.ts";

/**
 * Adwo is a functional React component that renders an SVG icon.
 *
 * It uses `IconProps` to accept properties for customization such as size, color,
 * and any additional properties. The component defaults to a size of 24 and a color
 * of 'currentColor', ensuring it adapts to the inherited text color by default.
 */
const Adwo: React.FC<IconProps> = ({size = 24, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={trueSize(size)}
        height={trueSize(size)}
        fill={color}
        {...props}
    >
        <path
            d="M20.196 12.001c1.743-.743 2.8-1.724 2.8-2.8 0-2.32-4.925-4.2-11-4.2s-11 1.88-11 4.2c0 1.076 1.06 2.057 2.8 2.8-1.743.743-2.8 1.724-2.8 2.8 0 2.319 4.925 4.2 11 4.2s11-1.881 11-4.2c.004-1.077-1.057-2.058-2.8-2.8M3.142 9.39c0-1.092 3.054-2.61 8.858-2.61s8.857 1.518 8.857 2.61-1.585 1.958-3.263 1.958a4.34 4.34 0 0 1-2.8-1.1 3.83 3.83 0 0 1-2.8 1.1 3.83 3.83 0 0 1-2.8-1.1 4.34 4.34 0 0 1-2.8 1.1c-1.67-.001-3.252-.865-3.252-1.958m12.4 2.611-.75.466-.75-.466.75-.467zm-5.594 0-.75.466-.75-.466.75-.467zm2.047 5.221c-5.8 0-8.858-1.518-8.858-2.611s1.585-1.958 3.264-1.958a4.34 4.34 0 0 1 2.8 1.1 3.83 3.83 0 0 1 2.8-1.1 3.84 3.84 0 0 1 2.8 1.1 4.34 4.34 0 0 1 2.8-1.1c1.678 0 3.263.866 3.263 1.958s-3.061 2.61-8.864 2.61z"/>
    </svg>
);

export default Adwo;
