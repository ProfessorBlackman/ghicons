import * as React from "react";
import {type IconProps, trueSize} from "../props.ts";

/**
 * Aban is a functional React component that renders an SVG icon.
 *
 * It uses `IconProps` to accept properties for customization such as size, color,
 * and any additional properties. The component defaults to a size of 24 and a color
 * of 'currentColor', ensuring it adapts to the inherited text color by default.
 */
const Aban: React.FC<IconProps> = ({size = 24, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={trueSize(size)}
        height={trueSize(size)}
        fill={color}
        {...props}
    >
        <path
            d="m18.243 3.378-2.081-2.081L12 5.459 7.838 1.297 5.757 3.378 3.379 1 1.001 3.378l2.378 2.378-2.081 2.08L5.46 12l-4.162 4.162 2.081 2.081-2.378 2.378 2.378 2.378 2.378-2.378L7.838 22.7 12 18.539l4.162 4.162 2.081-2.081 2.378 2.378 2.378-2.378-2.378-2.378 2.081-2.081-4.162-4.162 4.162-4.162-2.081-2.081 2.378-2.378L20.621 1zm0 4.459-4.162 4.162 4.162 4.162-2.081 2.081L12 14.08l-4.162 4.162-2.081-2.081 4.162-4.162-4.162-4.162 2.081-2.081L12 9.918l4.162-4.162z"/>
    </svg>
);

export default Aban;