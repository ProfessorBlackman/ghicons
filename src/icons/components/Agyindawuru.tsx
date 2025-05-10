import * as React from "react";
import {type IconProps, trueSize} from "../props.ts";

/**
 * Agyindawuru is a functional React component that renders an SVG icon.
 *
 * It uses `IconProps` to accept properties for customization such as size, color,
 * and any additional properties. The component defaults to a size of 24 and a color
 * of 'currentColor', ensuring it adapts to the inherited text color by default.
 */
const Agyindawuru: React.FC<IconProps> = ({size = 24, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={trueSize(size)}
        height={trueSize(size)}
        fill={color}
        {...props}
    >
        <path
            d="M19.052 12A5.629 5.629 0 1 0 12 4.948 5.628 5.628 0 1 0 4.948 12 5.627 5.627 0 1 0 12 19.052 5.627 5.627 0 1 0 19.052 12m-1.681 8.563a3.19 3.19 0 0 1-2.84-4.644l-.8-.8-1.733 1.733-1.733-1.733-.8.8a3.195 3.195 0 1 1-1.387-1.387l.8-.8-1.733-1.733 1.733-1.733-.8-.8a3.2 3.2 0 1 1 1.387-1.387l.8.8 1.733-1.733 1.733 1.733.8-.8a3.2 3.2 0 1 1 1.387 1.387l-.8.8 1.733 1.733-1.733 1.733.8.8a3.192 3.192 0 1 1 1.453 6.031"/>
    </svg>
);

export default Agyindawuru;
