import * as React from "react";
import {type IconProps, trueSize} from "../props.ts";

/**
 * Adinkrahene is a functional React component that renders an SVG icon.
 *
 * It uses `IconProps` to accept properties for customization such as size, color,
 * and any additional properties. The component defaults to a size of 24 and a color
 * of 'currentColor', ensuring it adapts to the inherited text color by default.
 */
const Adinkrahene: React.FC<IconProps> = ({size = 24, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={trueSize(size)}
        height={trueSize(size)}
        fill={color}
        {...props}
    >
        <path
            d="M12 1.005a11 11 0 1 0 0 22 11 11 0 0 0 0-22m0 20.128A9.14 9.14 0 0 1 2.867 12a9.14 9.14 0 0 1 9.129-9.129A9.14 9.14 0 0 1 21.125 12 9.14 9.14 0 0 1 12 21.129z"/>
        <path
            d="M11.965 4.635a7.343 7.343 0 0 0-7.334 7.334 7.34 7.34 0 0 0 7.334 7.334 7.34 7.34 0 0 0 7.332-7.338 7.343 7.343 0 0 0-7.332-7.33m0 12.8a5.468 5.468 0 0 1-.004-10.934 5.47 5.47 0 0 1 5.464 5.464 5.47 5.47 0 0 1-5.46 5.464z"/>
        <path
            d="M11.975 8.264a3.72 3.72 0 0 0-3.715 3.714 3.72 3.72 0 0 0 3.714 3.713 3.72 3.72 0 0 0 3.713-3.713 3.72 3.72 0 0 0-3.712-3.714m0 5.558a1.845 1.845 0 1 1 1.304-3.152 1.846 1.846 0 0 1 0 2.607c-.346.346-.815.54-1.304.541z"/>

    </svg>
);

export default Adinkrahene;
